import type { Options } from 'express-rate-limit';
import type { Request } from 'express';

import {
    AUTH_PUBLIC_LIMIT,
    AUTH_PUBLIC_WINDOW_MS,
    AUTHENTICATED_READ_LIMIT,
    AUTHENTICATED_READ_WINDOW_MS,
    COMPLETE_INTERVIEW_LIMIT,
    COMPLETE_INTERVIEW_WINDOW_MS,
    SPEECH_SYNTHESIZE_LIMIT,
    SPEECH_SYNTHESIZE_WINDOW_MS,
    SUBMIT_TURN_LIMIT,
    SUBMIT_TURN_WINDOW_MS,
} from '@constants/rate-limit.constants';

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import config from '@lib/config';

const isProduction = (): boolean => config.app.env === 'production';
const ipKey = (req: Request): string => ipKeyGenerator(req.ip ?? 'unknown');
const userKey = (req: Request): string => req.auth?.sub ?? ipKey(req);

const rateLimitHandler: Options['handler'] = (_req, res) => {
    res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
    });
};

const createLimiter = (
    options: Pick<Options, 'windowMs' | 'limit' | 'keyGenerator'>,
): ReturnType<typeof rateLimit> =>
    rateLimit({
        standardHeaders: true,
        legacyHeaders: false,
        skip: () => !isProduction(),
        handler: rateLimitHandler,
        ...options,
    });

export const authPublicLimiter = createLimiter({
    windowMs: AUTH_PUBLIC_WINDOW_MS,
    limit: AUTH_PUBLIC_LIMIT,
    keyGenerator: ipKey,
});

export const authenticatedReadLimiter = createLimiter({
    windowMs: AUTHENTICATED_READ_WINDOW_MS,
    limit: AUTHENTICATED_READ_LIMIT,
    keyGenerator: userKey,
});

export const submitTurnLimiter = createLimiter({
    windowMs: SUBMIT_TURN_WINDOW_MS,
    limit: SUBMIT_TURN_LIMIT,
    keyGenerator: userKey,
});

export const completeInterviewLimiter = createLimiter({
    windowMs: COMPLETE_INTERVIEW_WINDOW_MS,
    limit: COMPLETE_INTERVIEW_LIMIT,
    keyGenerator: userKey,
});

export const speechSynthesizeLimiter = createLimiter({
    windowMs: SPEECH_SYNTHESIZE_WINDOW_MS,
    limit: SPEECH_SYNTHESIZE_LIMIT,
    keyGenerator: userKey,
});
