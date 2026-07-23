import {
    INTERVIEWS_LIMIT_DEFAULT,
    INTERVIEWS_LIMIT_MAX,
    INTERVIEWS_PAGE_DEFAULT,
} from '@constants/interviews.constants';
import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid id',
});

export const listMyInterviewsQuerySchema = z.object({
    jobId: objectIdSchema.optional(),
    page: z.coerce.number().int().min(1).default(INTERVIEWS_PAGE_DEFAULT),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(INTERVIEWS_LIMIT_MAX)
        .default(INTERVIEWS_LIMIT_DEFAULT),
});

export const interviewIdParamsSchema = z.object({
    interviewId: objectIdSchema,
});

export const createInterviewBodySchema = z.object({
    jobId: objectIdSchema,
});
