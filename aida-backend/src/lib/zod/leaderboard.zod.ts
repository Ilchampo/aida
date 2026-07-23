import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid id',
});

export const jobLeaderboardParamsSchema = z.object({
    jobId: objectIdSchema,
});
