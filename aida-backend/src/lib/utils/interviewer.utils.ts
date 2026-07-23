import type {
    InterviewerCoverageState,
    InterviewerEngineResult,
    InterviewerJobContext,
    InterviewerInterviewContext,
    LlmInterviewerDecision,
} from '@interfaces/interviewer.interfaces';
import type { DecisionSource } from '@constants/schemas.constants';
import type { Types } from 'mongoose';

import {
    INTERVIEW_MAX_QUESTIONS,
    INTERVIEW_MIN_BEHAVIORAL_QUESTIONS,
    INTERVIEW_MIN_FOLLOW_UPS,
    INTERVIEW_MIN_QUESTIONS,
} from '@constants/interviews.constants';
import type { QuestionCategory } from '@constants/schemas.constants';
import {
    INTERVIEWER_SYSTEM_PROMPT,
    INTERVIEWER_TRANSCRIPT_WINDOW,
} from '@constants/interviewer.constants';
import type { OpenRouterChatMessage } from '@lib/openrouter/chat.client';
import {
    countAiQuestions,
    countFollowUpQuestions,
    meetsQuestionMinimums,
} from '@utils/interview.utils';
import type { InterviewerDecisionPayload } from '@zod/interviewer.zod';

type QuestionBankEntry = InterviewerJobContext['question_bank'][number] & {
    _id: Types.ObjectId;
};

export const getUsedPrimaryBankQuestionIds = (
    interview: InterviewerInterviewContext,
): Set<string> => {
    const used = new Set<string>();

    for (const turn of interview.transcript) {
        if (turn.speaker === 'ai' && !turn.is_follow_up && turn.question_id) {
            used.add(turn.question_id.toString());
        }
    }

    return used;
};

export const findBankQuestionById = (
    job: InterviewerJobContext,
    questionId: string,
): QuestionBankEntry | null => {
    const match = job.question_bank.find((entry) => entry._id.toString() === questionId);

    return match ?? null;
};

export const getLastAiQuestionId = (interview: InterviewerInterviewContext): string | null => {
    for (let index = interview.transcript.length - 1; index >= 0; index -= 1) {
        const turn = interview.transcript[index];

        if (turn?.speaker === 'ai' && turn.question_id) {
            return turn.question_id.toString();
        }
    }

    return null;
};

export const getUsedFollowUpTexts = (interview: InterviewerInterviewContext): Set<string> => {
    const used = new Set<string>();

    for (const turn of interview.transcript) {
        if (turn.speaker === 'ai' && turn.is_follow_up) {
            used.add(turn.text.trim());
        }
    }

    return used;
};

export const countPrimaryQuestionsByCategory = (
    interview: InterviewerInterviewContext,
    job: InterviewerJobContext,
    category: QuestionCategory,
): number => {
    let count = 0;

    for (const turn of interview.transcript) {
        if (turn.speaker !== 'ai' || turn.is_follow_up || !turn.question_id) {
            continue;
        }

        const bankQuestion = findBankQuestionById(job, turn.question_id.toString());

        if (bankQuestion?.category === category) {
            count += 1;
        }
    }

    return count;
};

const getCandidateAnswerSnippet = (interview: InterviewerInterviewContext): string | null => {
    for (let index = interview.transcript.length - 1; index >= 0; index -= 1) {
        const turn = interview.transcript[index];

        if (turn?.speaker === 'candidate' && turn.text.trim()) {
            return turn.text.trim();
        }
    }

    return null;
};

const buildDeterministicTransition = (interview: InterviewerInterviewContext): string => {
    const answer = getCandidateAnswerSnippet(interview);

    if (!answer) {
        return 'Thanks for sharing that.';
    }

    const snippet = answer.length > 80 ? `${answer.slice(0, 77).trim()}…` : answer;

    return `Thanks for explaining that — especially around "${snippet}".`;
};

const withDeterministicTransition = (
    interview: InterviewerInterviewContext,
    questionText: string,
): string => {
    const transition = buildDeterministicTransition(interview);

    return `${transition} ${questionText}`.trim();
};

export const buildCoverageState = (
    job: InterviewerJobContext,
    interview: InterviewerInterviewContext,
): InterviewerCoverageState => {
    const rubricSkills = job.rubric.map((item) => item.skill);
    const topicsFromQuestions = new Set<string>();

    for (const turn of interview.transcript) {
        if (turn.speaker === 'ai' && turn.question_id) {
            const bankQuestion = findBankQuestionById(job, turn.question_id.toString());

            if (bankQuestion) {
                topicsFromQuestions.add(bankQuestion.skill);
            }
        }
    }

    const latestLog = interview.decision_log.at(-1);

    const topicsCovered = [
        ...new Set([...topicsFromQuestions, ...(latestLog?.topics_covered ?? [])]),
    ];

    const skillsDetected = latestLog?.skills_detected ?? [];
    const gaps = rubricSkills.filter((skill) => !topicsCovered.includes(skill));

    return {
        rubricSkills,
        topicsCovered,
        skillsDetected,
        gaps,
    };
};

export const canEndInterview = (
    interview: InterviewerInterviewContext,
    coverage: InterviewerCoverageState,
    job: InterviewerJobContext,
): boolean => {
    if (!meetsQuestionMinimums(interview)) {
        return false;
    }

    if (
        countPrimaryQuestionsByCategory(interview, job, 'behavioral') <
        INTERVIEW_MIN_BEHAVIORAL_QUESTIONS
    ) {
        return false;
    }

    return coverage.gaps.length === 0;
};

export const buildEndResult = (
    turnIdx: number,
    coverage: InterviewerCoverageState,
    reason: string,
): InterviewerEngineResult => ({
    isFinal: true,
    questionText: '',
    questionId: null,
    isFollowUp: false,
    source: 'generated',
    decisionLogEntry: {
        turnIdx,
        source: 'generated',
        questionId: null,
        reason,
        skillsDetected: coverage.skillsDetected,
        topicsCovered: coverage.topicsCovered,
        gaps: coverage.gaps,
    },
});

const buildQuestionResult = (params: {
    turnIdx: number;
    questionText: string;
    questionId: string | null;
    isFollowUp: boolean;
    source: DecisionSource;
    reason: string;
    coverage: InterviewerCoverageState;
    skillsDetected?: string[];
    topicsCovered?: string[];
    gaps?: string[];
}): InterviewerEngineResult => ({
    isFinal: false,
    questionText: params.questionText,
    questionId: params.questionId,
    isFollowUp: params.isFollowUp,
    source: params.source,
    decisionLogEntry: {
        turnIdx: params.turnIdx,
        source: params.source,
        questionId: params.questionId,
        reason: params.reason,
        skillsDetected: params.skillsDetected ?? params.coverage.skillsDetected,
        topicsCovered: params.topicsCovered ?? params.coverage.topicsCovered,
        gaps: params.gaps ?? params.coverage.gaps,
    },
});

export const pickDeterministicBankQuestion = (
    job: InterviewerJobContext,
    interview: InterviewerInterviewContext,
    coverage: InterviewerCoverageState,
    turnIdx: number,
): InterviewerEngineResult | null => {
    const usedIds = getUsedPrimaryBankQuestionIds(interview);
    const unused = job.question_bank.filter((entry) => !usedIds.has(entry._id.toString()));

    if (unused.length === 0) {
        return null;
    }

    const behavioralAsked = countPrimaryQuestionsByCategory(interview, job, 'behavioral');
    const needsBehavioral = behavioralAsked < INTERVIEW_MIN_BEHAVIORAL_QUESTIONS;
    const behavioralPool = unused.filter((entry) => entry.category === 'behavioral');
    const technicalPool = unused.filter((entry) => entry.category === 'technical');

    let candidatePool = unused;

    if (needsBehavioral && behavioralPool.length > 0) {
        candidatePool = behavioralPool;
    } else if (
        behavioralAsked >= INTERVIEW_MIN_BEHAVIORAL_QUESTIONS &&
        technicalPool.length > 0 &&
        behavioralAsked > countPrimaryQuestionsByCategory(interview, job, 'technical')
    ) {
        candidatePool = technicalPool;
    } else if (behavioralPool.length > 0 && technicalPool.length > 0) {
        candidatePool =
            countPrimaryQuestionsByCategory(interview, job, 'technical') >= behavioralAsked
                ? behavioralPool
                : technicalPool;
    }

    const targetSkill =
        [...job.rubric]
            .sort((left, right) => right.weight - left.weight)
            .find((item) => coverage.gaps.includes(item.skill))?.skill ?? candidatePool[0]?.skill;

    const candidate =
        candidatePool.find((entry) => entry.skill === targetSkill) ??
        candidatePool.sort((left, right) => left.text.localeCompare(right.text))[0];

    if (!candidate) {
        return null;
    }

    const nextTopics = [...new Set([...coverage.topicsCovered, candidate.skill])];
    const nextGaps = coverage.rubricSkills.filter((skill) => !nextTopics.includes(skill));

    return buildQuestionResult({
        turnIdx,
        questionText: withDeterministicTransition(interview, candidate.text),
        questionId: candidate._id.toString(),
        isFollowUp: false,
        source: 'bank',
        reason: `Deterministic bank question targeting ${candidate.skill} (${candidate.category}).`,
        coverage,
        topicsCovered: nextTopics,
        gaps: nextGaps,
    });
};

export const pickDeterministicFollowUp = (
    job: InterviewerJobContext,
    interview: InterviewerInterviewContext,
    coverage: InterviewerCoverageState,
    turnIdx: number,
): InterviewerEngineResult | null => {
    const parentQuestionId = getLastAiQuestionId(interview);

    if (!parentQuestionId) {
        return null;
    }

    const bankQuestion = findBankQuestionById(job, parentQuestionId);

    if (!bankQuestion) {
        return null;
    }

    const usedFollowUps = getUsedFollowUpTexts(interview);
    const followUp = bankQuestion.follow_ups.find((entry) => !usedFollowUps.has(entry.text.trim()));

    if (!followUp) {
        return null;
    }

    return buildQuestionResult({
        turnIdx,
        questionText: withDeterministicTransition(interview, followUp.text),
        questionId: parentQuestionId,
        isFollowUp: true,
        source: 'bank',
        reason: `Deterministic follow-up on ${bankQuestion.skill}.`,
        coverage,
    });
};

export const resolveDeterministicDecision = (params: {
    job: InterviewerJobContext;
    interview: InterviewerInterviewContext;
    coverage: InterviewerCoverageState;
    turnIdx: number;
}): InterviewerEngineResult => {
    const { job, interview, coverage, turnIdx } = params;
    const followUpsAsked = countFollowUpQuestions(interview);

    if (canEndInterview(interview, coverage, job)) {
        return buildEndResult(
            turnIdx,
            coverage,
            'Minimum question and follow-up counts met with rubric coverage.',
        );
    }

    if (followUpsAsked < INTERVIEW_MIN_FOLLOW_UPS) {
        const followUp = pickDeterministicFollowUp(job, interview, coverage, turnIdx);

        if (followUp) {
            return followUp;
        }
    }

    const bankQuestion = pickDeterministicBankQuestion(job, interview, coverage, turnIdx);

    if (bankQuestion) {
        return bankQuestion;
    }

    if (meetsQuestionMinimums(interview)) {
        return buildEndResult(turnIdx, coverage, 'No remaining bank questions; ending interview.');
    }

    throw new Error('Interviewer engine exhausted question bank before meeting minimums.');
};

export const toLlmInterviewerDecision = (
    payload: InterviewerDecisionPayload,
): LlmInterviewerDecision => ({
    action: payload.action,
    questionId: payload.question_id,
    questionText: payload.question_text,
    reason: payload.reason,
    skillsDetected: payload.skills_detected,
    topicsCovered: payload.topics_covered,
    gaps: payload.gaps,
});

export const buildInterviewerJobContextPayload = (job: InterviewerJobContext) => ({
    title: job.title,
    role: job.role,
    rubric: job.rubric,
    question_bank: job.question_bank.map((entry) => ({
        id: entry._id.toString(),
        text: entry.text,
        skill: entry.skill,
        category: entry.category,
        follow_ups: entry.follow_ups,
    })),
});

export const buildInterviewerTurnStatePayload = (params: {
    job: InterviewerJobContext;
    interview: InterviewerInterviewContext;
    coverage: InterviewerCoverageState;
    questionsAsked: number;
    followUpsAsked: number;
}) => {
    const { job, interview, coverage, questionsAsked, followUpsAsked } = params;
    const usedPrimaryQuestionIds = [...getUsedPrimaryBankQuestionIds(interview)];
    const behavioralPrimaryAsked = countPrimaryQuestionsByCategory(interview, job, 'behavioral');
    const technicalPrimaryAsked = countPrimaryQuestionsByCategory(interview, job, 'technical');

    const recentTranscript = interview.transcript
        .slice(-INTERVIEWER_TRANSCRIPT_WINDOW)
        .map((turn) => `[${turn.speaker}] ${turn.text}`)
        .join('\n');

    return {
        coverage,
        budget: {
            questionsAsked,
            followUpsAsked,
            minQuestions: INTERVIEW_MIN_QUESTIONS,
            minFollowUps: INTERVIEW_MIN_FOLLOW_UPS,
            minBehavioralQuestions: INTERVIEW_MIN_BEHAVIORAL_QUESTIONS,
            maxQuestions: INTERVIEW_MAX_QUESTIONS,
        },
        categoryMix: {
            behavioralPrimaryAsked,
            technicalPrimaryAsked,
            behavioralPrimaryRemaining: INTERVIEW_MIN_BEHAVIORAL_QUESTIONS - behavioralPrimaryAsked,
        },
        usedPrimaryQuestionIds,
        recentTranscript,
    };
};

export const buildInterviewerChatMessages = (params: {
    job: InterviewerJobContext;
    interview: InterviewerInterviewContext;
    coverage: InterviewerCoverageState;
    questionsAsked: number;
    followUpsAsked: number;
}): OpenRouterChatMessage[] => {
    const jobContext = JSON.stringify(buildInterviewerJobContextPayload(params.job), null, 2);
    const turnState = JSON.stringify(
        buildInterviewerTurnStatePayload({
            job: params.job,
            interview: params.interview,
            coverage: params.coverage,
            questionsAsked: params.questionsAsked,
            followUpsAsked: params.followUpsAsked,
        }),
        null,
        2,
    );

    return [
        {
            role: 'system',
            content: INTERVIEWER_SYSTEM_PROMPT,
        },
        {
            role: 'user',
            content: [
                {
                    type: 'text',
                    text: jobContext,
                    cacheControl: {
                        type: 'ephemeral',
                    },
                },
                {
                    type: 'text',
                    text: turnState,
                },
            ],
        },
    ];
};

export const applyLlmDecision = (params: {
    decision: LlmInterviewerDecision;
    job: InterviewerJobContext;
    interview: InterviewerInterviewContext;
    coverage: InterviewerCoverageState;
    turnIdx: number;
}): InterviewerEngineResult | null => {
    const { decision, job, interview, coverage, turnIdx } = params;
    const usedPrimaryIds = getUsedPrimaryBankQuestionIds(interview);
    const questionsAsked = countAiQuestions(interview);
    const followUpsAsked = countFollowUpQuestions(interview);

    if (decision.action === 'end_interview') {
        if (questionsAsked < INTERVIEW_MIN_QUESTIONS || followUpsAsked < INTERVIEW_MIN_FOLLOW_UPS) {
            return null;
        }

        if (
            countPrimaryQuestionsByCategory(interview, job, 'behavioral') <
            INTERVIEW_MIN_BEHAVIORAL_QUESTIONS
        ) {
            return null;
        }

        return buildEndResult(turnIdx, coverage, decision.reason);
    }

    if (questionsAsked >= INTERVIEW_MAX_QUESTIONS) {
        return null;
    }

    if (decision.action === 'ask_bank_question') {
        if (!decision.questionId || usedPrimaryIds.has(decision.questionId)) {
            return null;
        }

        const bankQuestion = findBankQuestionById(job, decision.questionId);

        if (!bankQuestion) {
            return null;
        }

        const questionText = decision.questionText.trim() || bankQuestion.text;

        if (!questionText) {
            return null;
        }

        const nextTopics = [
            ...new Set([...decision.topicsCovered, ...coverage.topicsCovered, bankQuestion.skill]),
        ];
        const nextGaps = coverage.rubricSkills.filter((skill) => !nextTopics.includes(skill));

        return buildQuestionResult({
            turnIdx,
            questionText,
            questionId: bankQuestion._id.toString(),
            isFollowUp: false,
            source: 'bank',
            reason: decision.reason,
            coverage,
            skillsDetected: decision.skillsDetected,
            topicsCovered: nextTopics,
            gaps: nextGaps.length > 0 ? nextGaps : decision.gaps,
        });
    }

    if (decision.action === 'ask_follow_up') {
        if (!decision.questionId || !decision.questionText.trim()) {
            return null;
        }

        const bankQuestion = findBankQuestionById(job, decision.questionId);

        if (!bankQuestion) {
            return null;
        }

        const usedFollowUps = getUsedFollowUpTexts(interview);
        const normalizedText = decision.questionText.trim();
        const matchesBankFollowUp = bankQuestion.follow_ups.some(
            (entry) => entry.text.trim() === normalizedText,
        );

        if (!matchesBankFollowUp && !normalizedText) {
            return null;
        }

        if (usedFollowUps.has(normalizedText)) {
            return null;
        }

        return buildQuestionResult({
            turnIdx,
            questionText: normalizedText,
            questionId: decision.questionId,
            isFollowUp: true,
            source: 'bank',
            reason: decision.reason,
            coverage,
            skillsDetected: decision.skillsDetected,
            topicsCovered: decision.topicsCovered,
            gaps: decision.gaps,
        });
    }

    if (decision.action === 'generate_follow_up') {
        if (!decision.questionText.trim()) {
            return null;
        }

        const parentQuestionId = getLastAiQuestionId(interview);
        const usedFollowUps = getUsedFollowUpTexts(interview);
        const normalizedText = decision.questionText.trim();

        if (usedFollowUps.has(normalizedText)) {
            return null;
        }

        return buildQuestionResult({
            turnIdx,
            questionText: normalizedText,
            questionId: parentQuestionId,
            isFollowUp: true,
            source: 'generated',
            reason: decision.reason,
            coverage,
            skillsDetected: decision.skillsDetected,
            topicsCovered: decision.topicsCovered,
            gaps: decision.gaps,
        });
    }

    return null;
};
