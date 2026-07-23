import type {
    AbandonInterviewParams,
    AbandonInterviewResponse,
    CompleteInterviewParams,
    CompleteInterviewResponse,
    CreateInterviewParams,
    CreateInterviewResponse,
    GetInterviewDetailResponse,
    ListMyInterviewsParams,
    OwnerInterviewDetail,
    PaginatedOwnerInterviewListResponse,
    SubmitTurnParams,
    SubmitTurnResponse,
} from '@interfaces/interview.interfaces';

import {
    INTERVIEW_MAX_COMPLETED_TRIES_PER_ROLE,
    INTERVIEW_MAX_DISTINCT_ROLES,
} from '@constants/interviews.constants';
import { isMongoDuplicateKeyError } from '@utils/errors.utils';
import { SPEECH_MIN_RECORDING_BYTES } from '@constants/openrouter.constants';
import { ConflictError, NotFoundError, UnprocessableEntityError } from '@utils/errors.utils';
import { isReadyForCompletion } from '@utils/evaluation.utils';
import {
    buildSubmitTurnResponse,
    canAcceptTurns,
    countAiQuestions,
    findCandidateTurnByClientId,
    findIdempotentTurn,
    toOwnerInterviewDetail,
    toOwnerInterviewListItem,
    toSubmitTurnResponse,
} from '@utils/interview.utils';
import { decideNextQuestion } from '@services/interviewer.engine';
import { runInterviewEvaluation } from '@services/interview-evaluation.service';
import {
    resolveAudioFormat,
    synthesizeSpeechSafe,
    transcribeAudio,
} from '@lib/openrouter/speech.client';
import { interviewModel } from '@schemas/interview.schema';
import type { InterviewEvaluation } from '@schemas/interview.schema';
import { jobModel } from '@schemas/job.schema';
import { Types } from 'mongoose';

export const countDistinctCompletedRoles = async (candidateId: string): Promise<number> => {
    const roles = await interviewModel.distinct('job_id', {
        candidate_id: new Types.ObjectId(candidateId),
        status: 'completed',
    });

    return roles.length;
};

export const createInterview = async (
    params: CreateInterviewParams,
): Promise<CreateInterviewResponse> => {
    const { jobId, candidateId } = params;
    const candidateObjectId = new Types.ObjectId(candidateId);
    const jobObjectId = new Types.ObjectId(jobId);

    const job = await jobModel.findById(jobObjectId).select('_id').lean();

    if (!job) {
        throw new NotFoundError('Job not found');
    }

    const activeInterview = await interviewModel
        .findOne({
            candidate_id: candidateObjectId,
            status: 'in_progress',
        })
        .select('_id')
        .lean();

    if (activeInterview) {
        throw new ConflictError('An interview is already in progress', {
            interviewId: activeInterview._id.toString(),
        });
    }

    const completedForJob = await interviewModel.countDocuments({
        candidate_id: candidateObjectId,
        job_id: jobObjectId,
        status: 'completed',
    });

    if (completedForJob >= INTERVIEW_MAX_COMPLETED_TRIES_PER_ROLE) {
        throw new ConflictError('Maximum completed attempts reached for this interview');
    }

    const claimedJobIds = await interviewModel.distinct('job_id', {
        candidate_id: candidateObjectId,
        status: 'completed',
    });

    const alreadyClaimed = claimedJobIds.some((id) => id.equals(jobObjectId));

    if (!alreadyClaimed && claimedJobIds.length >= INTERVIEW_MAX_DISTINCT_ROLES) {
        throw new ConflictError('Maximum distinct practice interviews reached');
    }

    try {
        const interview = await interviewModel.create({
            job_id: jobObjectId,
            candidate_id: candidateObjectId,
            status: 'in_progress',
        });

        return {
            interviewId: interview._id.toString(),
            status: 'in_progress',
        };
    } catch (error) {
        if (isMongoDuplicateKeyError(error)) {
            const existing = await interviewModel
                .findOne({
                    candidate_id: candidateObjectId,
                    status: 'in_progress',
                })
                .select('_id')
                .lean();

            throw new ConflictError('An interview is already in progress', {
                interviewId: existing?._id.toString() ?? null,
            });
        }

        throw error;
    }
};

export const abandonInterview = async (
    params: AbandonInterviewParams,
): Promise<AbandonInterviewResponse> => {
    const { interviewId, candidateId } = params;

    const interview = await interviewModel.findOne({
        _id: new Types.ObjectId(interviewId),
        candidate_id: new Types.ObjectId(candidateId),
    });

    if (!interview) {
        throw new NotFoundError('Interview not found');
    }

    if (interview.status !== 'in_progress') {
        throw new ConflictError('Interview is no longer in progress');
    }

    interview.status = 'abandoned';
    interview.ended_at = new Date();

    await interview.save();

    return { status: 'abandoned' };
};

const persistIdempotentTurn = async (
    interview: Awaited<ReturnType<typeof interviewModel.findOne>>,
    clientTurnId: string,
    response: SubmitTurnResponse,
): Promise<void> => {
    if (!interview) {
        return;
    }

    interview.idempotent_turns.push({
        client_turn_id: clientTurnId,
        candidate_text: response.text,
        ai_text: response.aiText,
        ai_audio: response.aiAudio,
        ai_audio_content_type: response.aiAudioContentType,
        ai_speech_failed: response.aiSpeechFailed,
        is_final: response.isFinal,
        question_count: response.questionCount,
    });

    await interview.save();
};

export const submitTurn = async (params: SubmitTurnParams): Promise<SubmitTurnResponse> => {
    const {
        interviewId,
        candidateId,
        audio,
        audioMimeType,
        startedAt,
        endedAt,
        clientTurnId,
        format,
    } = params;

    const interview = await interviewModel.findOne({
        _id: new Types.ObjectId(interviewId),
        candidate_id: new Types.ObjectId(candidateId),
    });

    if (!interview) {
        throw new NotFoundError('Interview not found');
    }

    if (!canAcceptTurns(interview)) {
        throw new ConflictError('Interview is no longer in progress');
    }

    const cachedTurn = findIdempotentTurn(interview, clientTurnId);

    if (cachedTurn) {
        return toSubmitTurnResponse(cachedTurn);
    }

    const candidateTurnIdx = findCandidateTurnByClientId(interview, clientTurnId);
    const lastTurn = interview.transcript.at(-1);
    let candidateText: string;

    if (candidateTurnIdx !== -1) {
        const candidateTurn = interview.transcript[candidateTurnIdx];
        const aiTurnAfterCandidate = interview.transcript[candidateTurnIdx + 1];

        if (candidateTurn && aiTurnAfterCandidate?.speaker === 'ai') {
            const response = buildSubmitTurnResponse({
                text: candidateTurn.text,
                aiText: aiTurnAfterCandidate.text,
                aiAudio: null,
                aiAudioContentType: null,
                aiSpeechFailed: false,
                isFinal: false,
                questionCount: countAiQuestions(interview),
            });

            await persistIdempotentTurn(interview, clientTurnId, response);

            return response;
        }

        if (lastTurn !== candidateTurn || candidateTurn?.speaker !== 'candidate') {
            throw new ConflictError('Turn already processed');
        }

        candidateText = candidateTurn.text;
    } else {
        const audioFormat = resolveAudioFormat(audioMimeType, format);

        if (audio.length < SPEECH_MIN_RECORDING_BYTES) {
            throw new UnprocessableEntityError(
                "We couldn't transcribe your answer. Please try speaking again.",
            );
        }

        try {
            candidateText = await transcribeAudio(audio, audioFormat);
        } catch {
            throw new UnprocessableEntityError(
                "We couldn't transcribe your answer. Please try speaking again.",
            );
        }

        if (candidateText.length === 0) {
            throw new UnprocessableEntityError(
                "We couldn't transcribe your answer. Please try speaking again.",
            );
        }

        interview.transcript.push({
            idx: interview.transcript.length,
            speaker: 'candidate',
            text: candidateText,
            started_at: new Date(startedAt),
            ended_at: new Date(endedAt),
            question_id: null,
            is_follow_up: false,
            client_turn_id: clientTurnId,
        });

        await interview.save();
    }

    const job = await jobModel.findById(interview.job_id).lean();

    if (!job) {
        throw new NotFoundError('Job not found');
    }

    const engineResult = await decideNextQuestion({ job, interview });
    const now = new Date();
    const aiText = engineResult.isFinal ? '' : engineResult.questionText;
    let aiAudio: string | null = null;
    let aiAudioContentType: string | null = null;
    let aiSpeechFailed = false;

    if (!engineResult.isFinal) {
        interview.transcript.push({
            idx: interview.transcript.length,
            speaker: 'ai',
            text: engineResult.questionText,
            started_at: now,
            ended_at: now,
            question_id: engineResult.questionId
                ? new Types.ObjectId(engineResult.questionId)
                : null,
            is_follow_up: engineResult.isFollowUp,
            client_turn_id: null,
        });

        interview.decision_log.push({
            turn_idx: engineResult.decisionLogEntry.turnIdx,
            source: engineResult.decisionLogEntry.source,
            question_id: engineResult.decisionLogEntry.questionId
                ? new Types.ObjectId(engineResult.decisionLogEntry.questionId)
                : null,
            reason: engineResult.decisionLogEntry.reason,
            skills_detected: engineResult.decisionLogEntry.skillsDetected,
            topics_covered: engineResult.decisionLogEntry.topicsCovered,
            gaps: engineResult.decisionLogEntry.gaps,
        });

        const speech = await synthesizeSpeechSafe(aiText);

        if (speech) {
            aiAudio = speech.audioBase64;
            aiAudioContentType = speech.contentType;
        } else {
            aiSpeechFailed = true;
        }
    }

    const response = buildSubmitTurnResponse({
        text: candidateText,
        aiText,
        aiAudio,
        aiAudioContentType,
        aiSpeechFailed,
        isFinal: engineResult.isFinal,
        questionCount: countAiQuestions(interview),
    });

    await persistIdempotentTurn(interview, clientTurnId, response);

    return response;
};

export const completeInterview = async (
    params: CompleteInterviewParams,
): Promise<CompleteInterviewResponse> => {
    const { interviewId, candidateId } = params;

    const interview = await interviewModel.findOne({
        _id: new Types.ObjectId(interviewId),
        candidate_id: new Types.ObjectId(candidateId),
    });

    if (!interview) {
        throw new NotFoundError('Interview not found');
    }

    if (interview.status === 'completed') {
        return { status: 'completed' };
    }

    if (interview.status !== 'in_progress') {
        throw new ConflictError('Interview is no longer in progress');
    }

    if (!isReadyForCompletion(interview)) {
        throw new ConflictError('Interview is not ready to complete');
    }

    const job = await jobModel.findById(interview.job_id).lean();

    if (!job) {
        throw new NotFoundError('Job not found');
    }

    const evaluation = await runInterviewEvaluation({ job, interview });

    interview.evaluation = evaluation as InterviewEvaluation;
    interview.status = 'completed';
    interview.ended_at = new Date();

    await interview.save();

    return { status: 'completed' };
};

export const getActiveInterview = async (
    candidateId: string,
): Promise<OwnerInterviewDetail | null> => {
    const interview = await interviewModel
        .findOne({
            candidate_id: new Types.ObjectId(candidateId),
            status: 'in_progress',
        })
        .lean();

    if (!interview) {
        return null;
    }

    const job = await jobModel.findById(interview.job_id).select('_id title role').lean();

    if (!job) {
        throw new NotFoundError('Interview not found');
    }

    return toOwnerInterviewDetail(interview, job);
};

export const listMyInterviews = async (
    params: ListMyInterviewsParams,
): Promise<PaginatedOwnerInterviewListResponse> => {
    const { candidateId, page, limit, jobId } = params;

    const filter: {
        candidate_id: Types.ObjectId;
        status: 'completed';
        job_id?: Types.ObjectId;
    } = {
        candidate_id: new Types.ObjectId(candidateId),
        status: 'completed',
    };

    if (jobId) {
        filter.job_id = new Types.ObjectId(jobId);
    }

    const totalItems = await interviewModel.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const interviews = await interviewModel
        .find(filter)
        .sort({ ended_at: -1, started_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const jobIds = [...new Set(interviews.map((interview) => interview.job_id.toString()))];
    const jobs = await jobModel
        .find({ _id: { $in: jobIds } })
        .select('_id title role')
        .lean();
    const jobById = new Map(jobs.map((job) => [job._id.toString(), job]));

    const items = interviews.flatMap((interview) => {
        const job = jobById.get(interview.job_id.toString());

        if (!job) {
            return [];
        }

        return [toOwnerInterviewListItem(interview, job)];
    });

    return {
        items,
        page: currentPage,
        totalPages,
        totalItems,
    };
};

export const getInterviewByIdForOwner = async (
    interviewId: string,
    candidateId: string,
): Promise<GetInterviewDetailResponse> => {
    const interview = await interviewModel
        .findOne({
            _id: new Types.ObjectId(interviewId),
            candidate_id: new Types.ObjectId(candidateId),
            status: { $in: ['completed', 'in_progress'] },
        })
        .lean();

    if (!interview) {
        throw new NotFoundError('Interview not found');
    }

    const job = await jobModel.findById(interview.job_id).select('_id title role').lean();

    if (!job) {
        throw new NotFoundError('Interview not found');
    }

    return toOwnerInterviewDetail(interview, job);
};
