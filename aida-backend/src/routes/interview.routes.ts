import { Router } from 'express';

import { validateRequest } from '@middlewares/validation.middleware';
import { requireAuth } from '@middlewares/auth.middleware';
import {
    authenticatedReadLimiter,
    completeInterviewLimiter,
    submitTurnLimiter,
} from '@middlewares/rate-limit.middleware';
import { submitTurnUpload } from '@middlewares/upload.middleware';
import {
    createInterviewBodySchema,
    interviewIdParamsSchema,
    listMyInterviewsQuerySchema,
} from '@zod/interviews.zod';

import * as interviewController from '@controllers/interview.controllers';

const interviewRouter = Router();

// @route   POST /api/interviews
// @desc    Start an interview session for a practice role (quota-enforced)
// @access  Private
interviewRouter.post(
    '/',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ body: createInterviewBodySchema }),
    interviewController.createInterview,
);

// @route   GET /api/interviews/me/active
// @desc    Get the caller's in-progress interview for resume, if any
// @access  Private
interviewRouter.get(
    '/me/active',
    requireAuth,
    authenticatedReadLimiter,
    interviewController.getActiveInterview,
);

// @route   GET /api/interviews/me
// @desc    List the caller's completed interviews (progression)
// @access  Private
interviewRouter.get(
    '/me',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ query: listMyInterviewsQuerySchema }),
    interviewController.listMyInterviews,
);

// @route   POST /api/interviews/:interviewId/abandon
// @desc    Leave mid-interview — marks session abandoned, no evaluation
// @access  Private (session owner)
interviewRouter.post(
    '/:interviewId/abandon',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ params: interviewIdParamsSchema }),
    interviewController.abandonInterview,
);

// @route   POST /api/interviews/:interviewId/turns
// @desc    Submit candidate answer audio and receive next AI question
// @access  Private (session owner)
interviewRouter.post(
    '/:interviewId/turns',
    requireAuth,
    submitTurnLimiter,
    validateRequest({ params: interviewIdParamsSchema }),
    submitTurnUpload,
    interviewController.submitTurn,
);

// @route   POST /api/interviews/:interviewId/complete
// @desc    Evaluate rubric and close interview (completed)
// @access  Private (session owner)
interviewRouter.post(
    '/:interviewId/complete',
    requireAuth,
    completeInterviewLimiter,
    validateRequest({ params: interviewIdParamsSchema }),
    interviewController.completeInterview,
);

// @route   GET /api/interviews/:interviewId
// @desc    Get owned interview detail (completed results or in-progress resume)
// @access  Private (session owner)
interviewRouter.get(
    '/:interviewId',
    requireAuth,
    authenticatedReadLimiter,
    validateRequest({ params: interviewIdParamsSchema }),
    interviewController.getInterviewById,
);

export default interviewRouter;
