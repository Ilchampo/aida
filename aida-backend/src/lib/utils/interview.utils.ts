import type {
    InterviewDecisionLogEntry,
    InterviewEvaluationDetail,
    InterviewJobSummary,
    OwnerInterviewDetail,
    OwnerInterviewListItem,
    InterviewPhase,
    InterviewTranscriptTurn,
    IdempotentTurnRecord,
    SubmitTurnResponse,
} from '@interfaces/interview.interfaces';
import type { InterviewStatus } from '@constants/schemas.constants';
import type { Interview } from '@schemas/interview.schema';
import type { Job } from '@schemas/job.schema';
import type { Types } from 'mongoose';

import {
    INTERVIEW_MAX_QUESTIONS,
    INTERVIEW_MIN_FOLLOW_UPS,
    INTERVIEW_MIN_QUESTIONS,
} from '@constants/interviews.constants';

type InterviewLean = Interview & { _id: Types.ObjectId };
type InterviewTranscriptHolder = Pick<Interview, 'transcript'>;
type InterviewBudgetHolder = Pick<Interview, 'transcript' | 'status'>;
type JobLean = Pick<Job, 'title' | 'role'> & { _id: Types.ObjectId };

const toIsoString = (value: Date | null | undefined): string | null => {
    if (!value) {
        return null;
    }

    return value.toISOString();
};

export const countAiQuestions = (interview: InterviewTranscriptHolder): number =>
    interview.transcript.filter((turn) => turn.speaker === 'ai').length;

export const countFollowUpQuestions = (interview: InterviewTranscriptHolder): number =>
    interview.transcript.filter((turn) => turn.speaker === 'ai' && turn.is_follow_up).length;

export const countQuestionsAsked = (interview: InterviewTranscriptHolder): number =>
    countAiQuestions(interview);

export const hasReachedQuestionCap = (interview: InterviewTranscriptHolder): boolean =>
    countAiQuestions(interview) >= INTERVIEW_MAX_QUESTIONS;

export const meetsQuestionMinimums = (interview: InterviewTranscriptHolder): boolean =>
    countAiQuestions(interview) >= INTERVIEW_MIN_QUESTIONS &&
    countFollowUpQuestions(interview) >= INTERVIEW_MIN_FOLLOW_UPS;

export const canAcceptTurns = (interview: InterviewBudgetHolder): boolean =>
    interview.status === 'in_progress';

export const isTerminalStatus = (status: InterviewStatus): boolean =>
    status === 'completed' || status === 'abandoned';

export const getInterviewPhase = (status: InterviewStatus): InterviewPhase =>
    status === 'in_progress' ? 'active' : 'terminal';

export const findIdempotentTurn = (
    interview: InterviewLean,
    clientTurnId: string,
): IdempotentTurnRecord | null => {
    const match = interview.idempotent_turns.find((entry) => entry.client_turn_id === clientTurnId);

    if (!match) {
        return null;
    }

    return {
        clientTurnId: match.client_turn_id,
        text: match.candidate_text,
        aiText: match.ai_text,
        aiAudio: match.ai_audio ?? null,
        aiAudioContentType: match.ai_audio_content_type ?? null,
        aiSpeechFailed: match.ai_speech_failed,
        isFinal: match.is_final,
        questionCount: match.question_count,
    };
};

export const toSubmitTurnResponse = (record: IdempotentTurnRecord): SubmitTurnResponse => ({
    text: record.text,
    aiText: record.aiText,
    aiAudio: record.aiAudio,
    aiAudioContentType: record.aiAudioContentType,
    aiSpeechFailed: record.aiSpeechFailed,
    isFinal: record.isFinal,
    questionCount: record.questionCount,
});

export const findCandidateTurnByClientId = (
    interview: InterviewTranscriptHolder,
    clientTurnId: string,
): number =>
    interview.transcript.findIndex(
        (turn) => turn.speaker === 'candidate' && turn.client_turn_id === clientTurnId,
    );

export const buildSubmitTurnResponse = (params: {
    text: string;
    aiText: string;
    aiAudio: string | null;
    aiAudioContentType: string | null;
    aiSpeechFailed: boolean;
    isFinal: boolean;
    questionCount: number;
}): SubmitTurnResponse => ({
    text: params.text,
    aiText: params.aiText,
    aiAudio: params.aiAudio,
    aiAudioContentType: params.aiAudioContentType,
    aiSpeechFailed: params.aiSpeechFailed,
    isFinal: params.isFinal,
    questionCount: params.questionCount,
});

export const calculateInterviewDuration = (interview: InterviewLean): number | null => {
    if (!interview.started_at || !interview.ended_at) {
        return null;
    }

    return Math.floor((interview.ended_at.getTime() - interview.started_at.getTime()) / 1000);
};

export const toInterviewJobSummary = (job: JobLean): InterviewJobSummary => ({
    _id: job._id.toString(),
    title: job.title,
    role: job.role,
});

const toInterviewTranscriptTurn = (
    turn: InterviewLean['transcript'][number],
): InterviewTranscriptTurn => ({
    idx: turn.idx,
    speaker: turn.speaker,
    text: turn.text,
    startedAt: turn.started_at.toISOString(),
    endedAt: turn.ended_at.toISOString(),
    questionId: turn.question_id ? turn.question_id.toString() : null,
    isFollowUp: turn.is_follow_up,
});

const toInterviewDecisionLogEntry = (
    entry: InterviewLean['decision_log'][number],
): InterviewDecisionLogEntry => ({
    turnIdx: entry.turn_idx,
    source: entry.source,
    questionId: entry.question_id ? entry.question_id.toString() : null,
    reason: entry.reason,
    skillsDetected: entry.skills_detected,
    topicsCovered: entry.topics_covered,
    gaps: entry.gaps,
});

const toInterviewEvaluationDetail = (
    evaluation: NonNullable<InterviewLean['evaluation']>,
): InterviewEvaluationDetail => ({
    overallScore: evaluation.overall_score,
    perSkill: evaluation.per_skill.map((item) => ({
        skill: item.skill,
        score: item.score,
        evidence: item.evidence,
    })),
    strengths: evaluation.strengths,
    concerns: evaluation.concerns,
    summary: evaluation.summary,
});

export const toOwnerInterviewListItem = (
    interview: InterviewLean,
    job: JobLean,
): OwnerInterviewListItem => ({
    _id: interview._id.toString(),
    job: toInterviewJobSummary(job),
    status: 'completed',
    startedAt: interview.started_at.toISOString(),
    endedAt: toIsoString(interview.ended_at),
    overallScore: interview.evaluation?.overall_score ?? null,
    questionsAsked: countQuestionsAsked(interview),
    duration: calculateInterviewDuration(interview),
});

export const toOwnerInterviewDetail = (
    interview: InterviewLean,
    job: JobLean,
): OwnerInterviewDetail => ({
    _id: interview._id.toString(),
    job: toInterviewJobSummary(job),
    status: interview.status,
    startedAt: interview.started_at.toISOString(),
    endedAt: toIsoString(interview.ended_at),
    transcript: interview.transcript.map(toInterviewTranscriptTurn),
    decisionLog: interview.decision_log.map(toInterviewDecisionLogEntry),
    evaluation: interview.evaluation ? toInterviewEvaluationDetail(interview.evaluation) : null,
    questionsAsked: countQuestionsAsked(interview),
});
