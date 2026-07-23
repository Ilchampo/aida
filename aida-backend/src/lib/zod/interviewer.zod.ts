import { INTERVIEWER_ACTIONS } from '@constants/interviewer.constants';
import { z } from 'zod';

const nullableObjectIdSchema = z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === '' ? null : value));

export const interviewerDecisionSchema = z.object({
    action: z.enum(INTERVIEWER_ACTIONS),
    question_id: nullableObjectIdSchema,
    question_text: z.string().trim(),
    reason: z.string().trim().min(1),
    skills_detected: z.array(z.string().trim()),
    topics_covered: z.array(z.string().trim()),
    gaps: z.array(z.string().trim()),
});

export type InterviewerDecisionPayload = z.infer<typeof interviewerDecisionSchema>;
