import { Router } from 'express';

import { validateRequest } from '@middlewares/validation.middleware';
import { requireAuth } from '@middlewares/auth.middleware';
import { authenticatedReadLimiter } from '@middlewares/rate-limit.middleware';
import { jobLeaderboardParamsSchema } from '@zod/leaderboard.zod';

import * as leaderboardController from '@controllers/leaderboard.controllers';

const leaderboardRouter = Router();

// @route   GET /api/leaderboard/global
// @desc    Top 10 by average of each user's best score per completed role
// @access  Private
leaderboardRouter.get(
    '/global',
    requireAuth,
    authenticatedReadLimiter,
    leaderboardController.getGlobalLeaderboard,
);

// @route   GET /api/leaderboard/jobs/:jobId
// @desc    Top 10 by best completed score for a practice role
// @access  Private
leaderboardRouter.get(
    '/jobs/:jobId',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ params: jobLeaderboardParamsSchema }),
    leaderboardController.getJobLeaderboard,
);

export default leaderboardRouter;
