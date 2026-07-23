import { useCallback, useEffect, useRef, useState } from 'react';

import { synthesizeSpeech } from '@api/speech.api';
import type { PlayableSpeech } from '@lib/interfaces/speech.interface';

import {
    decodeBase64ToBytes,
    isAudioPlaybackSupported,
    releaseAudioBlobUrl,
    createAudioBlobUrl,
} from '@lib/utils/speech.util';

export interface SpeechPlaybackResult {
    played: boolean;
    speechFailed: boolean;
}

interface UseAudioPlaybackResult {
    supported: boolean;
    isSpeaking: boolean;
    speak: (text: string) => Promise<SpeechPlaybackResult>;
    speakFromBase64: (speech: PlayableSpeech) => Promise<SpeechPlaybackResult>;
    cancel: VoidFunction;
}

const BLOB_REVOKE_DELAY_MS = 250;

const waitForAudioGesture = (): Promise<void> =>
    new Promise((resolve) => {
        const resume = () => {
            window.removeEventListener('pointerdown', resume, true);
            window.removeEventListener('keydown', resume, true);
            resolve();
        };

        window.addEventListener('pointerdown', resume, { once: true, capture: true });
        window.addEventListener('keydown', resume, { once: true, capture: true });
    });

const detachAudioElement = (audio: HTMLAudioElement): void => {
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    audio.removeAttribute('src');
    audio.load();
};

const loadAudioElement = (audio: HTMLAudioElement): Promise<void> =>
    new Promise((resolve, reject) => {
        if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            resolve();
            return;
        }

        const onReady = () => {
            cleanup();
            resolve();
        };

        const onError = () => {
            cleanup();
            reject(new Error('Audio failed to load.'));
        };

        const cleanup = () => {
            audio.removeEventListener('canplaythrough', onReady);
            audio.removeEventListener('error', onError);
        };

        audio.addEventListener('canplaythrough', onReady);
        audio.addEventListener('error', onError);
        audio.load();
    });

const playAudioElement = async (audio: HTMLAudioElement): Promise<void> => {
    try {
        await audio.play();
    } catch (error) {
        if (!(error instanceof DOMException) || error.name !== 'NotAllowedError') {
            throw error;
        }

        await waitForAudioGesture();
        await audio.play();
    }
};

const waitForAudioEnd = (audio: HTMLAudioElement): Promise<void> =>
    new Promise((resolve, reject) => {
        audio.onended = () => {
            resolve();
        };

        audio.onerror = () => {
            reject(new Error('Audio playback failed.'));
        };
    });

export const useAudioPlayback = (): UseAudioPlaybackResult => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const activeUrlRef = useRef<string | null>(null);
    const activeAudioRef = useRef<HTMLAudioElement | null>(null);
    const revokeTimeoutRef = useRef<number | null>(null);

    const clearRevokeTimeout = useCallback(() => {
        if (revokeTimeoutRef.current !== null) {
            window.clearTimeout(revokeTimeoutRef.current);
            revokeTimeoutRef.current = null;
        }
    }, []);

    const scheduleBlobRelease = useCallback(
        (url: string) => {
            clearRevokeTimeout();
            revokeTimeoutRef.current = window.setTimeout(() => {
                releaseAudioBlobUrl(url);
                revokeTimeoutRef.current = null;
            }, BLOB_REVOKE_DELAY_MS);
        },
        [clearRevokeTimeout],
    );

    const cancel = useCallback(() => {
        clearRevokeTimeout();

        const audio = activeAudioRef.current;

        if (audio) {
            detachAudioElement(audio);
            activeAudioRef.current = null;
        }

        if (activeUrlRef.current) {
            scheduleBlobRelease(activeUrlRef.current);
            activeUrlRef.current = null;
        }

        setIsSpeaking(false);
    }, [clearRevokeTimeout, scheduleBlobRelease]);

    const speakFromBase64 = useCallback(
        async (speech: PlayableSpeech): Promise<SpeechPlaybackResult> => {
            cancel();

            if (!isAudioPlaybackSupported()) {
                return { played: false, speechFailed: true };
            }

            if (!speech.audioBase64.trim()) {
                return { played: false, speechFailed: true };
            }

            let url: string;

            try {
                url = createAudioBlobUrl(
                    decodeBase64ToBytes(speech.audioBase64),
                    speech.contentType,
                );
            } catch {
                return { played: false, speechFailed: true };
            }

            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = url;

            activeUrlRef.current = url;
            activeAudioRef.current = audio;
            setIsSpeaking(true);

            try {
                await loadAudioElement(audio);
                await playAudioElement(audio);
                await waitForAudioEnd(audio);

                return { played: true, speechFailed: false };
            } catch {
                return { played: false, speechFailed: true };
            } finally {
                detachAudioElement(audio);
                activeAudioRef.current = null;

                if (activeUrlRef.current === url) {
                    scheduleBlobRelease(url);
                    activeUrlRef.current = null;
                }

                setIsSpeaking(false);
            }
        },
        [cancel, scheduleBlobRelease],
    );

    const speak = useCallback(
        async (text: string): Promise<SpeechPlaybackResult> => {
            const trimmed = text.trim();

            if (!trimmed) {
                return { played: true, speechFailed: false };
            }

            try {
                const response = await synthesizeSpeech(trimmed);

                if (response.speechFailed || !response.audio || !response.contentType) {
                    return { played: false, speechFailed: true };
                }

                return speakFromBase64({
                    audioBase64: response.audio,
                    contentType: response.contentType,
                });
            } catch {
                return { played: false, speechFailed: true };
            }
        },
        [speakFromBase64],
    );

    useEffect(() => {
        return () => {
            cancel();
        };
    }, [cancel]);

    return {
        supported: isAudioPlaybackSupported(),
        isSpeaking,
        speak,
        speakFromBase64,
        cancel,
    };
};
