import { JOBS_LIMIT_DEFAULT, JOBS_LIMIT_MAX, JOBS_PAGE_DEFAULT } from '@constants/jobs.constants';
import { Types } from 'mongoose';
import { z } from 'zod';

const optionalTitleSchema = z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional();

export const listJobsQuerySchema = z.object({
    title: optionalTitleSchema,
    page: z.coerce.number().int().min(1).default(JOBS_PAGE_DEFAULT),
    limit: z.coerce.number().int().min(1).max(JOBS_LIMIT_MAX).default(JOBS_LIMIT_DEFAULT),
});

export const jobIdParamsSchema = z.object({
    id: z.string().refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid job id',
    }),
});
