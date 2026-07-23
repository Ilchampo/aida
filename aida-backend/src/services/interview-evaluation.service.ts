import type {
    RunInterviewEvaluationInput,
    InterviewEvaluationResult,
} from '@interfaces/evaluation.interfaces';

import { EVALUATION_LLM_SCHEMA_NAME } from '@constants/evaluation.constants';
import { isOpenRouterConfigured, sendEvaluationChatCompletion } from '@lib/openrouter/chat.client';
import { evaluationResultSchema } from '@zod/evaluation.zod';
import {
    buildDeterministicEvaluation,
    formatTranscriptForEvaluation,
    normalizeEvaluationForRubric,
    toInterviewEvaluation,
} from '@utils/evaluation.utils';

const EVALUATION_LLM_JSON_SCHEMA = {
    type: 'object',
    properties: {
        overall_score: {
            type: 'number',
        },
        per_skill: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    skill: { type: 'string' },
                    score: { type: 'number' },
                    evidence: { type: 'string' },
                },
                required: ['skill', 'score', 'evidence'],
                additionalProperties: false,
            },
        },
        strengths: {
            type: 'array',
            items: { type: 'string' },
        },
        concerns: {
            type: 'array',
            items: { type: 'string' },
        },
        summary: {
            type: 'string',
        },
    },
    required: ['overall_score', 'per_skill', 'strengths', 'concerns', 'summary'],
    additionalProperties: false,
} as const;

const buildEvaluationSystemPrompt = (): string =>
    [
        'You are a senior recruiter evaluating a completed intern or trainee interview.',
        'Score the candidate strictly against the job rubric using only evidence from the transcript.',
        'Use a 0-100 scale with these anchors: 90+ exceptional with concrete examples, 75-89 solid with minor gaps, 60-74 partial understanding, below 60 insufficient evidence.',
        'Penalize vague, theoretical, or unsubstantiated answers. Reward specific examples, trade-off reasoning, and correct terminology.',
        'A rubric signal counts only when the candidate demonstrates understanding — not when they merely mention a keyword.',
        'Return one per_skill entry for every rubric skill.',
        'Strengths and concerns must be concise bullet-style strings grounded in answers.',
    ].join('\n');

const buildEvaluationUserPrompt = (input: RunInterviewEvaluationInput): string =>
    JSON.stringify(
        {
            job: {
                title: input.job.title,
                role: input.job.role,
            },
            rubric: input.job.rubric,
            transcript: formatTranscriptForEvaluation(input.interview.transcript),
            decisionLog: input.interview.decision_log,
        },
        null,
        2,
    );

const requestLlmEvaluation = async (
    input: RunInterviewEvaluationInput,
): Promise<InterviewEvaluationResult> => {
    const content = await sendEvaluationChatCompletion({
        messages: [
            {
                role: 'system',
                content: buildEvaluationSystemPrompt(),
            },
            {
                role: 'user',
                content: buildEvaluationUserPrompt(input),
            },
        ],
        responseFormat: {
            type: 'json_schema',
            jsonSchema: {
                name: EVALUATION_LLM_SCHEMA_NAME,
                strict: true,
                schema: EVALUATION_LLM_JSON_SCHEMA,
            },
        },
    });

    const parsedJson: unknown = JSON.parse(content);
    const payload = evaluationResultSchema.parse(parsedJson);

    return normalizeEvaluationForRubric(toInterviewEvaluation(payload), input.job);
};

export const runInterviewEvaluation = async (
    input: RunInterviewEvaluationInput,
): Promise<InterviewEvaluationResult> => {
    if (isOpenRouterConfigured()) {
        try {
            return await requestLlmEvaluation(input);
        } catch (error) {
            console.error('Interview evaluation LLM failed; using deterministic fallback.', error);
        }
    }

    return buildDeterministicEvaluation(input.job, input.interview);
};
