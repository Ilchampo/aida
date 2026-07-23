import { SPEECH_AUDIO_MAX_BYTES } from '@constants/openrouter.constants';

import multer from 'multer';

export const submitTurnUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: SPEECH_AUDIO_MAX_BYTES,
    },
}).single('audio');
