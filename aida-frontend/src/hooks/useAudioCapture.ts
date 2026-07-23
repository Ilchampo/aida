import { useCallback, useEffect, useRef, useState } from 'react';

import type { AudioCaptureResult } from '@lib/interfaces/speech.interface';

import { INTERVIEW_ANSWER_MAX_SECONDS } from '@lib/constants/room.constants';
import {
    isMediaRecorderSupported,
    requestMicrophoneAccess,
    selectRecordingMimeType,
} from '@lib/utils/speech.util';

interface UseAudioCaptureOptions {
    onAutoStop?: (result: AudioCaptureResult | null) => void;
}

interface UseAudioCaptureResult {
    supported: boolean;
    isListening: boolean;
    isStarting: boolean;
    recordingSeconds: number;
    error: string | null;
    startListening: () => Promise<boolean>;
    stopListening: () => Promise<AudioCaptureResult | null>;
    resetError: VoidFunction;
}

const RECORDING_TIMESLICE_MS = 250;
const RECORDING_TICK_MS = 200;

export const useAudioCapture = (options?: UseAudioCaptureOptions): UseAudioCaptureResult => {
    const [isListening, setIsListening] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startedAtRef = useRef<string | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);
    const stopResolverRef = useRef<((result: AudioCaptureResult | null) => void) | null>(null);
    const mimeTypeRef = useRef<string>('audio/webm');
    const onAutoStopRef = useRef(options?.onAutoStop);
    const startGenerationRef = useRef(0);
    const startCancelledRef = useRef(false);
    const isListeningRef = useRef(false);

    useEffect(() => {
        onAutoStopRef.current = options?.onAutoStop;
    }, [options?.onAutoStop]);

    const clearRecordingTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const clearAutoStopTimer = useCallback(() => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const stopMediaStream = useCallback(() => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
    }, []);

    const cleanupRecorder = useCallback(() => {
        clearAutoStopTimer();
        clearRecordingTimer();
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        startedAtRef.current = null;
        stopMediaStream();
        isListeningRef.current = false;
        setIsListening(false);
        setRecordingSeconds(0);
    }, [clearAutoStopTimer, clearRecordingTimer, stopMediaStream]);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const finalizeCapture = useCallback((): AudioCaptureResult | null => {
        const startedAt = startedAtRef.current;

        if (!startedAt || chunksRef.current.length === 0) {
            return null;
        }

        const audioBlob = new Blob(chunksRef.current, {
            type: mimeTypeRef.current,
        });

        if (audioBlob.size === 0) {
            return null;
        }

        return {
            audioBlob,
            startedAt,
            endedAt: new Date().toISOString(),
        };
    }, []);

    const tickRecordingSeconds = useCallback(() => {
        const startedAt = startedAtRef.current;

        if (!startedAt) {
            return;
        }

        const elapsedSeconds = Math.floor((Date.now() - Date.parse(startedAt)) / 1000);

        setRecordingSeconds(Math.min(Math.max(elapsedSeconds, 0), INTERVIEW_ANSWER_MAX_SECONDS));
    }, []);

    const stopListening = useCallback((): Promise<AudioCaptureResult | null> => {
        if (isStarting && !mediaRecorderRef.current) {
            startCancelledRef.current = true;
            startGenerationRef.current += 1;
            setIsStarting(false);
            return Promise.resolve(null);
        }

        const recorder = mediaRecorderRef.current;

        if (!recorder || recorder.state === 'inactive') {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            stopResolverRef.current = resolve;

            recorder.onstop = () => {
                clearAutoStopTimer();
                clearRecordingTimer();

                const resolver = stopResolverRef.current;
                stopResolverRef.current = null;
                const result = finalizeCapture();

                cleanupRecorder();
                resolver?.(result);
            };

            recorder.onerror = () => {
                setError('Unable to record your answer. Please try again.');

                const resolver = stopResolverRef.current;
                stopResolverRef.current = null;

                cleanupRecorder();
                resolver?.(null);
            };

            try {
                recorder.stop();
            } catch {
                cleanupRecorder();
                stopResolverRef.current = null;
                resolve(finalizeCapture());
            }
        });
    }, [cleanupRecorder, clearAutoStopTimer, clearRecordingTimer, finalizeCapture, isStarting]);

    const startListening = useCallback((): Promise<boolean> => {
        if (isListeningRef.current || isStarting) {
            return Promise.resolve(false);
        }

        const generation = ++startGenerationRef.current;
        startCancelledRef.current = false;
        setIsStarting(true);

        return (async () => {
            const micAccess = await requestMicrophoneAccess();

            if (generation !== startGenerationRef.current || startCancelledRef.current) {
                setIsStarting(false);
                return false;
            }

            if (micAccess.granted === false) {
                setError(micAccess.message);
                setIsStarting(false);
                return false;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mimeType = selectRecordingMimeType() ?? 'audio/webm';

                if (generation !== startGenerationRef.current || startCancelledRef.current) {
                    stream.getTracks().forEach((track) => track.stop());
                    setIsStarting(false);
                    return false;
                }

                mimeTypeRef.current = mimeType;
                mediaStreamRef.current = stream;
                chunksRef.current = [];
                startedAtRef.current = new Date().toISOString();

                const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current = recorder;
                recorder.start(RECORDING_TIMESLICE_MS);
                setError(null);
                setRecordingSeconds(0);
                isListeningRef.current = true;
                setIsListening(true);
                setIsStarting(false);

                tickRecordingSeconds();
                intervalRef.current = window.setInterval(tickRecordingSeconds, RECORDING_TICK_MS);

                timeoutRef.current = window.setTimeout(() => {
                    void stopListening().then((result) => {
                        onAutoStopRef.current?.(result);
                    });
                }, INTERVIEW_ANSWER_MAX_SECONDS * 1000);

                return true;
            } catch {
                cleanupRecorder();
                setIsStarting(false);
                setError('Unable to start recording. Please try again.');
                return false;
            }
        })();
    }, [cleanupRecorder, isStarting, stopListening, tickRecordingSeconds]);

    useEffect(() => {
        return () => {
            startCancelledRef.current = true;
            startGenerationRef.current += 1;
            setIsStarting(false);
            clearAutoStopTimer();
            clearRecordingTimer();

            const recorder = mediaRecorderRef.current;

            if (recorder && recorder.state !== 'inactive') {
                try {
                    recorder.stop();
                } catch {
                    console.error('Failed to stop audio recorder');
                }
            }

            cleanupRecorder();
        };
    }, [cleanupRecorder, clearAutoStopTimer, clearRecordingTimer]);

    return {
        supported: isMediaRecorderSupported(),
        isListening,
        isStarting,
        recordingSeconds,
        error,
        startListening,
        stopListening,
        resetError,
    };
};
