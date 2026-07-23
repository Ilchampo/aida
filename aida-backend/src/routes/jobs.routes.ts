import { Router } from 'express';

import { validateRequest } from '@middlewares/validation.middleware';
import { requireAuth } from '@middlewares/auth.middleware';
import { authenticatedReadLimiter } from '@middlewares/rate-limit.middleware';
import { jobIdParamsSchema, listJobsQuerySchema } from '@zod/jobs.zod';

import * as jobsController from '@controllers/jobs.controllers';

const jobsRouter = Router();

// @route   GET /api/jobs
// @desc    Get paginated practice interview listings with optional fuzzy title filter
// @access  Private
jobsRouter.get(
    '/',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ query: listJobsQuerySchema }),
    jobsController.listJobs,
);

// @route   GET /api/jobs/:id
// @desc    Get practice role details with attempt / quota summary for the caller
// @access  Private
jobsRouter.get(
    '/:id',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ params: jobIdParamsSchema }),
    jobsController.getJobById,
);

export default jobsRouter;
