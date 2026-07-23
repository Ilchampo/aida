import { Router } from 'express';

import { validateRequest } from '@middlewares/validation.middleware';
import { requireAuth } from '@middlewares/auth.middleware';
import { authPublicLimiter, authenticatedReadLimiter } from '@middlewares/rate-limit.middleware';
import { googleSignInSchema } from '@zod/auth.zod';

import * as authController from '@controllers/auth.controllers';

const authRouter = Router();

// @route   POST /api/auth/google
// @desc    Sign in with a Google ID token
// @access  Public
authRouter.post(
    '/google',
    authPublicLimiter,
    validateRequest({ body: googleSignInSchema }),
    authController.signInWithGoogle,
);

// @route   POST /api/auth/logout
// @desc    Log out a user
// @access  Public
authRouter.post('/logout', authController.logout);

// @route   GET /api/auth/me
// @desc    Get the current user and interview quota summary
// @access  Private
authRouter.get('/me', requireAuth, authenticatedReadLimiter, authController.me);

export default authRouter;
