import {
    MICROPHONE_DENIED_MESSAGE,
    MIN_AUDIO_BYTES,
    MIN_RECORDING_MS,
} from '@lib/constants/room.constants';
import type { AudioCaptureResult } from '@lib/interfaces/speech.interface';

export type MicrophoneAccessResult = { granted: true } | { granted: false; message: string };

export const isMediaRecorderSupported = (): boolean =>
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia);

export const isAudioPlaybackSupported = (): boolean =>
    typeof window !== 'undefined' && typeof Audio !== 'undefined';

export const isSpeechSupported = (): boolean =>
    isMediaRecorderSupported() && isAudioPlaybackSupported();

export const requestMicrophoneAccess = async (): Promise<MicrophoneAccessResult> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return {
            granted: false,
            message: 'Microphone access is not available in this browser.',
        };
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        stream.getTracks().forEach((track) => track.stop());

        return { granted: true };
    } catch (error) {
        if (
            error instanceof DOMException &&
            (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
        ) {
            return {
                granted: false,
                message: MICROPHONE_DENIED_MESSAGE,
            };
        }

        return {
            granted: false,
            message: 'Unable to access the microphone. Please try again.',
        };
    }
};

export const selectRecordingMimeType = (): string | undefined => {
    if (
        typeof MediaRecorder === 'undefined' ||
        typeof MediaRecorder.isTypeSupported !== 'function'
    ) {
        return undefined;
    }

    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];

    return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate));
};

export const decodeBase64ToBytes = (audioBase64: string): Uint8Array => {
    const binary = atob(audioBase64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
};

export const createAudioBlobUrl = (audio: Uint8Array | string, contentType: string): string => {
    const bytes = typeof audio === 'string' ? decodeBase64ToBytes(audio) : audio;

    return URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: contentType }));
};

export const releaseAudioBlobUrl = (url: string): void => {
    URL.revokeObjectURL(url);
};

export const isCaptureTooShort = (capture: AudioCaptureResult | null): boolean => {
    if (!capture?.audioBlob.size) {
        return true;
    }

    if (capture.audioBlob.size < MIN_AUDIO_BYTES) {
        return true;
    }

    const durationMs = Date.parse(capture.endedAt) - Date.parse(capture.startedAt);

    return !Number.isFinite(durationMs) || durationMs < MIN_RECORDING_MS;
};
