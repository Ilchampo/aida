import { EVALUATION_SCORE_MAX, EVALUATION_SCORE_MIN } from '@constants/evaluation.constants';
import { z } from 'zod';

const scoreSchema = z.number().min(EVALUATION_SCORE_MIN).max(EVALUATION_SCORE_MAX);

export const evaluationPerSkillSchema = z.object({
    skill: z.string().trim().min(1),
    score: scoreSchema,
    evidence: z.string().trim().min(1),
});

export const evaluationResultSchema = z.object({
    overall_score: scoreSchema,
    per_skill: z.array(evaluationPerSkillSchema).min(1),
    strengths: z.array(z.string().trim().min(1)).min(1),
    concerns: z.array(z.string().trim().min(1)).min(1),
    summary: z.string().trim().min(1),
});

export type EvaluationResultPayload = z.infer<typeof evaluationResultSchema>;
