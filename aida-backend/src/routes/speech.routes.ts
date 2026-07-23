import { Router } from 'express';

import { validateRequest } from '@middlewares/validation.middleware';
import { requireAuth } from '@middlewares/auth.middleware';
import { speechSynthesizeLimiter } from '@middlewares/rate-limit.middleware';
import { synthesizeSpeechBodySchema } from '@zod/speech.zod';

import * as speechController from '@controllers/speech.controllers';

const speechRouter = Router();

// @route   POST /api/speech/synthesize
// @desc    Synthesize interview speech audio from text
// @access  Private
speechRouter.post(
    '/synthesize',
    requireAuth,
    speechSynthesizeLimiter,
    validateRequest({ body: synthesizeSpeechBodySchema }),
    speechController.synthesizeSpeech,
);

export default speechRouter;
