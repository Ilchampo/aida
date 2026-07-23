import type { Config } from '@interfaces/config.interfaces';

import {
    OPENROUTER_STT_MODEL_DEFAULT,
    OPENROUTER_TTS_MODEL_DEFAULT,
    OPENROUTER_TTS_RESPONSE_FORMAT_DEFAULT,
    OPENROUTER_TTS_VOICE_DEFAULT,
} from '@constants/openrouter.constants';

import dotenv from 'dotenv';

dotenv.config();

const resolveTtsResponseFormat = (): 'mp3' | 'pcm' => {
    const value =
        process.env['OPENROUTER_TTS_RESPONSE_FORMAT'] ?? OPENROUTER_TTS_RESPONSE_FORMAT_DEFAULT;

    return value === 'pcm' ? 'pcm' : 'mp3';
};

const parseCorsWhitelist = (): string[] => {
    const value = process.env['CORS_WHITELIST'] ?? '';

    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

const config: Config = {
    app: {
        port: parseInt(process.env['PORT'] ?? '3000'),
        env: process.env['NODE_ENV'] ?? 'development',
    },
    cors: {
        whitelist: parseCorsWhitelist(),
    },
    mongo: {
        uri: process.env['MONGO_URI'] ?? '',
        dbName: process.env['MONGO_DB_NAME'] ?? 'ainterviewer',
    },
    openRouter: {
        apiKey: process.env['OPENROUTER_API_KEY'] ?? '',
        interviewerModel: process.env['OPENROUTER_INTERVIEWER_MODEL'] ?? 'google/gemini-2.5-flash',
        evaluationModel: process.env['OPENROUTER_EVALUATION_MODEL'] ?? 'google/gemini-2.5-pro',
        sttModel: process.env['OPENROUTER_STT_MODEL'] ?? OPENROUTER_STT_MODEL_DEFAULT,
        ttsModel: process.env['OPENROUTER_TTS_MODEL'] ?? OPENROUTER_TTS_MODEL_DEFAULT,
        ttsVoice: process.env['OPENROUTER_TTS_VOICE'] ?? OPENROUTER_TTS_VOICE_DEFAULT,
        ttsResponseFormat: resolveTtsResponseFormat(),
    },
    jwt: {
        secret: process.env['JWT_SECRET'] ?? '',
        expiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
    },
    google: {
        clientId: process.env['GOOGLE_CLIENT_ID'] ?? '',
    },
};

export default config;
