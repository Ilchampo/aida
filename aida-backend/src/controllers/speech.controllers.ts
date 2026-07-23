import type { SynthesizeSpeechResponse } from '@interfaces/speech.interfaces';

import { controller } from '@utils/controller.utils';
import { UnauthorizedError } from '@utils/errors.utils';
import { synthesizeSpeechBodySchema } from '@zod/speech.zod';

import { synthesizeSpeechSafe } from '@lib/openrouter/speech.client';

export const synthesizeSpeech = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { text } = synthesizeSpeechBodySchema.parse(req.body);
    const speech = await synthesizeSpeechSafe(text);

    if (!speech) {
        const data: SynthesizeSpeechResponse = {
            audio: null,
            contentType: null,
            speechFailed: true,
        };

        return { statusCode: 200, data };
    }

    const data: SynthesizeSpeechResponse = {
        audio: speech.audioBase64,
        contentType: speech.contentType,
        speechFailed: false,
    };

    return { statusCode: 200, data };
});
