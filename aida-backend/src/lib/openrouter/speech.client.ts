import config from '@lib/config';
import { SPEECH_STT_LANGUAGE } from '@constants/openrouter.constants';
import { isOpenRouterConfigured } from '@lib/openrouter/chat.client';
import { wrapPcm16InWav } from '@lib/utils/audio.utils';
import { openRouterInstance } from '@instances/openrouter.instance';

const MIME_TO_AUDIO_FORMAT: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/ogg': 'ogg',
    'audio/mp4': 'm4a',
    'audio/aac': 'aac',
    'audio/flac': 'flac',
};

export const resolveAudioFormat = (mimeType: string, explicitFormat?: string): string => {
    if (explicitFormat?.trim()) {
        return explicitFormat.trim().toLowerCase();
    }

    const normalizedMime = mimeType.split(';')[0]?.trim().toLowerCase() ?? '';
    const mapped = MIME_TO_AUDIO_FORMAT[normalizedMime];

    if (!mapped) {
        throw new Error(`Unsupported audio format: ${mimeType}`);
    }

    return mapped;
};

export const transcribeAudio = async (audio: Buffer, format: string): Promise<string> => {
    if (!isOpenRouterConfigured()) {
        throw new Error('OpenRouter is not configured for speech-to-text');
    }

    try {
        const response = await openRouterInstance.client.stt.createTranscription({
            sttRequest: {
                model: config.openRouter.sttModel,
                inputAudio: {
                    data: audio.toString('base64'),
                    format,
                },
                language: SPEECH_STT_LANGUAGE,
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error('OpenRouter speech-to-text failed.', error);

        throw new Error('Speech-to-text failed', { cause: error });
    }
};

const readStreamToBuffer = async (stream: ReadableStream<Uint8Array>): Promise<Buffer> => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        if (value) {
            chunks.push(value);
        }
    }

    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
};

const MIN_PCM_BYTES = 512;

const isLikelyPcmAudio = (buffer: Buffer): boolean => {
    if (buffer.length < MIN_PCM_BYTES) {
        return false;
    }

    const prefix = buffer.subarray(0, 1).toString('utf8');

    if (prefix === '{' || prefix === '<') {
        return false;
    }

    return true;
};

export const synthesizeSpeech = async (
    text: string,
): Promise<{ audioBase64: string; contentType: string }> => {
    if (!isOpenRouterConfigured()) {
        throw new Error('OpenRouter is not configured for text-to-speech');
    }

    const stream = await openRouterInstance.client.tts.createSpeech({
        speechRequest: {
            model: config.openRouter.ttsModel,
            input: text,
            voice: config.openRouter.ttsVoice,
            responseFormat: config.openRouter.ttsResponseFormat,
        },
    });

    const audioBuffer = await readStreamToBuffer(stream);

    if (!isLikelyPcmAudio(audioBuffer) && config.openRouter.ttsResponseFormat === 'pcm') {
        throw new Error('OpenRouter text-to-speech returned invalid PCM audio');
    }

    if (audioBuffer.length === 0) {
        throw new Error('OpenRouter text-to-speech returned empty audio');
    }

    if (config.openRouter.ttsResponseFormat === 'pcm') {
        return {
            audioBase64: wrapPcm16InWav(audioBuffer).toString('base64'),
            contentType: 'audio/wav',
        };
    }

    return {
        audioBase64: audioBuffer.toString('base64'),
        contentType: 'audio/mpeg',
    };
};

export const synthesizeSpeechSafe = async (
    text: string,
): Promise<{ audioBase64: string; contentType: string } | null> => {
    try {
        return await synthesizeSpeech(text);
    } catch (error) {
        console.error('OpenRouter text-to-speech failed.', error);

        return null;
    }
};
