import type {
    DecideNextQuestionInput,
    InterviewerEngineResult,
    LlmInterviewerDecision,
} from '@interfaces/interviewer.interfaces';

import { INTERVIEW_MAX_QUESTIONS } from '@constants/interviews.constants';
import { INTERVIEWER_LLM_SCHEMA_NAME, INTERVIEWER_ACTIONS } from '@constants/interviewer.constants';
import { isOpenRouterConfigured, sendInterviewerChatCompletion } from '@lib/openrouter/chat.client';
import { interviewerDecisionSchema } from '@zod/interviewer.zod';
import { countAiQuestions, countFollowUpQuestions } from '@utils/interview.utils';
import {
    applyLlmDecision,
    buildCoverageState,
    buildEndResult,
    buildInterviewerChatMessages,
    resolveDeterministicDecision,
    toLlmInterviewerDecision,
} from '@utils/interviewer.utils';

const INTERVIEWER_LLM_JSON_SCHEMA = {
    type: 'object',
    properties: {
        action: {
            type: 'string',
            enum: INTERVIEWER_ACTIONS,
        },
        question_id: {
            type: ['string', 'null'],
        },
        question_text: {
            type: 'string',
        },
        reason: {
            type: 'string',
        },
        skills_detected: {
            type: 'array',
            items: { type: 'string' },
        },
        topics_covered: {
            type: 'array',
            items: { type: 'string' },
        },
        gaps: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: [
        'action',
        'question_id',
        'question_text',
        'reason',
        'skills_detected',
        'topics_covered',
        'gaps',
    ],
    additionalProperties: false,
} as const;

const requestLlmDecision = async (
    input: DecideNextQuestionInput,
    coverage: ReturnType<typeof buildCoverageState>,
    budget: { questionsAsked: number; followUpsAsked: number },
): Promise<LlmInterviewerDecision | null> => {
    const content = await sendInterviewerChatCompletion({
        sessionId: input.interview._id.toString(),
        messages: buildInterviewerChatMessages({
            job: input.job,
            interview: input.interview,
            coverage,
            questionsAsked: budget.questionsAsked,
            followUpsAsked: budget.followUpsAsked,
        }),
        responseFormat: {
            type: 'json_schema',
            jsonSchema: {
                name: INTERVIEWER_LLM_SCHEMA_NAME,
                strict: true,
                schema: INTERVIEWER_LLM_JSON_SCHEMA,
            },
        },
    });

    const parsedJson: unknown = JSON.parse(content);
    const payload = interviewerDecisionSchema.parse(parsedJson);

    return toLlmInterviewerDecision(payload);
};

export const decideNextQuestion = async (
    input: DecideNextQuestionInput,
): Promise<InterviewerEngineResult> => {
    const { job, interview } = input;

    const coverage = buildCoverageState(job, interview);
    const questionsAsked = countAiQuestions(interview);
    const followUpsAsked = countFollowUpQuestions(interview);

    const nextTurnIdx = interview.transcript.length;

    if (questionsAsked >= INTERVIEW_MAX_QUESTIONS) {
        return buildEndResult(nextTurnIdx, coverage, 'Question cap reached.');
    }

    let llmDecision: LlmInterviewerDecision | null = null;

    if (isOpenRouterConfigured()) {
        try {
            llmDecision = await requestLlmDecision(input, coverage, {
                questionsAsked,
                followUpsAsked,
            });
        } catch (error) {
            console.error('Interviewer LLM request failed; using deterministic fallback.', error);
        }
    }

    if (llmDecision) {
        const applied = applyLlmDecision({
            decision: llmDecision,
            job,
            interview,
            coverage,
            turnIdx: nextTurnIdx,
        });

        if (applied) {
            return applied;
        }

        console.warn(
            'Interviewer LLM decision rejected by guardrails; using deterministic fallback.',
        );
    }

    return resolveDeterministicDecision({
        job,
        interview,
        coverage,
        turnIdx: nextTurnIdx,
    });
};
