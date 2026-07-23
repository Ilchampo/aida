import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    abandonInterview,
    completeInterview,
    createInterview,
    getInterviewById,
    submitTurn,
} from '@api/interview.api';
import { synthesizeSpeech } from '@api/speech.api';
import type { SubmitTurnBody } from '@lib/interfaces/interview.interface';
import type { RoomInterviewState, RoomMessage } from '@lib/interfaces/room.interface';
import type { AudioCaptureResult } from '@lib/interfaces/speech.interface';
import {
    DIDNT_UNDERSTAND_SPEECH,
    EMPTY_SPEECH_MESSAGE,
    formatRoomGoodbye,
    formatRoomWelcome,
    ROOM_STATE_LABELS,
    STT_FAILED_MESSAGE,
    TTS_PLAYBACK_FAILED_MESSAGE,
    TURN_SUBMIT_RETRY_MESSAGE,
} from '@lib/constants/room.constants';
import { useAudioCapture } from '@hooks/useAudioCapture';
import { useAudioPlayback } from '@hooks/useAudioPlayback';
import {
    isCaptureTooShort,
    isSpeechSupported,
    requestMicrophoneAccess,
} from '@lib/utils/speech.util';
import { ApiError } from '@lib/utils/apiCaller';

type SessionPhase = 'none' | 'active' | 'completed' | 'abandoned';

interface UseInterviewSessionParams {
    jobId: string;
    jobTitle: string;
    role: string;
    enabled: boolean;
    resumeInterviewId?: string | null;
    onComplete: (interviewId: string) => void;
}

interface UseInterviewSessionResult {
    bootstrapping: boolean;
    preparingMic: boolean;
    sessionError: string | null;
    turnError: string | null;
    turnCanRetry: boolean;
    interviewState: RoomInterviewState;
    messages: RoomMessage[];
    questionCount: number;
    isSpeaking: boolean;
    isRecording: boolean;
    recordingSeconds: number;
    toggleMic: VoidFunction;
    statusLabel: string;
    micDisabled: boolean;
    leaveDisabled: boolean;
    retryBootstrap: VoidFunction;
    clearTurnError: VoidFunction;
    retryTurn: VoidFunction;
    abandonSession: () => Promise<void>;
}

const createMessageId = (): string => crypto.randomUUID();

const isFatalTurnError = (error: unknown): boolean => {
    if (!(error instanceof ApiError)) {
        return false;
    }

    return error.statusCode === 409 || error.statusCode === 404 || error.statusCode === 401;
};

const isSttTurnError = (error: unknown): boolean =>
    error instanceof ApiError && error.statusCode === 422;

const isRetryableSubmitError = (error: unknown): boolean => {
    if (error instanceof ApiError) {
        return error.statusCode >= 500 || error.statusCode === 0;
    }

    return error instanceof TypeError;
};

const submitTurnWithRetry = async (interviewId: string, body: SubmitTurnBody) => {
    try {
        return await submitTurn(interviewId, body);
    } catch (error) {
        if (!isRetryableSubmitError(error)) {
            throw error;
        }

        return submitTurn(interviewId, body);
    }
};

const completeInterviewWithSilentRetry = async (interviewId: string): Promise<void> => {
    try {
        await completeInterview(interviewId);
    } catch (error) {
        if (!isRetryableSubmitError(error)) {
            return;
        }

        try {
            await completeInterview(interviewId);
        } catch {
            // Silent retry — interview may remain in_progress until a later attempt.
        }
    }
};

export const useInterviewSession = (
    params: UseInterviewSessionParams,
): UseInterviewSessionResult => {
    const { jobId, jobTitle, role, enabled, resumeInterviewId = null, onComplete } = params;

    const [bootstrapping, setBootstrapping] = useState(false);
    const [preparingMic, setPreparingMic] = useState(false);
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [turnError, setTurnError] = useState<string | null>(null);
    const [turnCanRetry, setTurnCanRetry] = useState(false);
    const [interviewState, setInterviewState] = useState<RoomInterviewState>('idle');
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [bootstrapAttempt, setBootstrapAttempt] = useState(0);
    const [prepareAttempt, setPrepareAttempt] = useState(0);
    const [interviewId, setInterviewId] = useState<string | null>(null);
    const [isWelcomeReady, setIsWelcomeReady] = useState(false);
    const [isFinishingInterview, setIsFinishingInterview] = useState(false);

    const interviewIdRef = useRef<string | null>(null);
    const sessionPhaseRef = useRef<SessionPhase>('none');
    const welcomeSpokenRef = useRef(false);
    const sessionErrorKindRef = useRef<'none' | 'mic' | 'other'>('none');
    const isSubmittingRef = useRef(false);
    const pendingTurnRef = useRef<{ capture: AudioCaptureResult; clientTurnId: string } | null>(
        null,
    );
    const handleSubmitTurnRef = useRef<(capture: AudioCaptureResult) => Promise<void>>(
        async () => {},
    );
    const handleUnrecognizedCaptureRef = useRef<() => Promise<void>>(async () => {});
    const speakRef = useRef<(text: string) => Promise<{ speechFailed: boolean }>>(async () => ({
        speechFailed: false,
    }));
    const speakFromBase64Ref = useRef<
        (speech: { audioBase64: string; contentType: string }) => Promise<{ speechFailed: boolean }>
    >(async () => ({ speechFailed: false }));
    const isFinishingInterviewRef = useRef(false);
    const interviewStateRef = useRef<RoomInterviewState>('idle');
    const welcomeSpeechPrefetchRef = useRef<{
        audioBase64: string;
        contentType: string;
    } | null>(null);

    useEffect(() => {
        interviewIdRef.current = interviewId;
    }, [interviewId]);

    useEffect(() => {
        interviewStateRef.current = interviewState;
    }, [interviewState]);

    useEffect(() => {
        isFinishingInterviewRef.current = isFinishingInterview;
    }, [isFinishingInterview]);

    const handleAutoStopCapture = useCallback((capture: AudioCaptureResult | null) => {
        if (interviewStateRef.current !== 'listening') {
            return;
        }

        if (isCaptureTooShort(capture)) {
            setInterviewState('idle');
            void handleUnrecognizedCaptureRef.current();
            return;
        }

        setInterviewState('transcribing');
        void handleSubmitTurnRef.current(capture!);
    }, []);

    const {
        supported: captureSupported,
        isListening: isRecording,
        isStarting: isStartingCapture,
        recordingSeconds,
        startListening,
        stopListening,
        resetError: resetCaptureError,
    } = useAudioCapture({ onAutoStop: handleAutoStopCapture });

    const speechSupported = isSpeechSupported() && captureSupported;

    const { isSpeaking, speak, speakFromBase64, cancel: cancelSpeech } = useAudioPlayback();

    useEffect(() => {
        speakRef.current = speak;
    }, [speak]);

    useEffect(() => {
        speakFromBase64Ref.current = speakFromBase64;
    }, [speakFromBase64]);

    const playSpokenText = useCallback(
        async (
            text: string,
            audio?: { audioBase64: string | null; contentType: string | null } | null,
        ): Promise<boolean> => {
            const trimmed = text.trim();

            if (audio?.audioBase64 && audio.contentType) {
                const cachedPlayback = await speakFromBase64Ref.current({
                    audioBase64: audio.audioBase64,
                    contentType: audio.contentType,
                });

                if (!cachedPlayback.speechFailed) {
                    return true;
                }
            }

            if (!trimmed) {
                return true;
            }

            const synthesizedPlayback = await speakRef.current(trimmed);

            return !synthesizedPlayback.speechFailed;
        },
        [],
    );

    const appendMessage = useCallback((message: RoomMessage) => {
        setMessages((current) => [...current, message]);
    }, []);

    const appendSpeechFailureNotice = useCallback(() => {
        appendMessage({
            id: createMessageId(),
            type: 'system',
            content: TTS_PLAYBACK_FAILED_MESSAGE,
        });
    }, [appendMessage]);

    const handleUnrecognizedCapture = useCallback(async () => {
        setTurnError(EMPTY_SPEECH_MESSAGE);
        setTurnCanRetry(false);
        setInterviewState('idle');

        const playback = await speakRef.current(DIDNT_UNDERSTAND_SPEECH);

        if (playback.speechFailed) {
            appendSpeechFailureNotice();
        }
    }, [appendSpeechFailureNotice]);

    useEffect(() => {
        handleUnrecognizedCaptureRef.current = handleUnrecognizedCapture;
    }, [handleUnrecognizedCapture]);

    const retryBootstrap = useCallback(() => {
        if (
            interviewIdRef.current &&
            sessionPhaseRef.current === 'active' &&
            sessionErrorKindRef.current === 'mic'
        ) {
            setSessionError(null);
            sessionErrorKindRef.current = 'none';
            setPrepareAttempt((attempt) => attempt + 1);
            return;
        }

        setBootstrapAttempt((attempt) => attempt + 1);
    }, []);

    const clearTurnError = useCallback(() => {
        setTurnError(null);
        setTurnCanRetry(false);
        pendingTurnRef.current = null;
    }, []);

    const abandonSession = useCallback(async () => {
        if (isFinishingInterviewRef.current) {
            return;
        }

        const activeInterviewId = interviewIdRef.current;

        if (!activeInterviewId || sessionPhaseRef.current !== 'active') {
            return;
        }

        sessionPhaseRef.current = 'abandoned';
        cancelSpeech();
        await stopListening();
        setInterviewState('idle');

        try {
            await abandonInterview(activeInterviewId);
        } catch (error) {
            if (!(error instanceof ApiError && error.statusCode === 409)) {
                throw error;
            }
        }
    }, [cancelSpeech, stopListening]);

    useEffect(() => {
        return () => {
            cancelSpeech();
        };
    }, [cancelSpeech]);

    useEffect(() => {
        if (!enabled || !jobId || !speechSupported) {
            return;
        }

        let mounted = true;

        const bootstrap = async () => {
            setBootstrapping(true);
            setPreparingMic(false);
            setSessionError(null);
            sessionErrorKindRef.current = 'none';
            setTurnError(null);
            setTurnCanRetry(false);
            setInterviewState('idle');
            setMessages([]);
            setQuestionCount(0);
            setInterviewId(null);
            setPrepareAttempt(0);
            setIsWelcomeReady(false);
            welcomeSpokenRef.current = false;
            welcomeSpeechPrefetchRef.current = null;
            sessionPhaseRef.current = 'none';
            pendingTurnRef.current = null;

            const welcomeText = formatRoomWelcome({ jobTitle, role });

            try {
                if (resumeInterviewId) {
                    const existing = await getInterviewById(resumeInterviewId);

                    if (!mounted) {
                        return;
                    }

                    if (existing.status !== 'in_progress' || existing.job._id !== jobId) {
                        throw new ApiError('Interview session is no longer available', 409);
                    }

                    const restoredMessages: RoomMessage[] = existing.transcript.map((turn) => ({
                        id: createMessageId(),
                        type: turn.speaker === 'ai' ? 'ai' : 'candidate',
                        content: turn.text,
                    }));

                    setInterviewId(existing._id);
                    setQuestionCount(existing.questionsAsked);
                    setMessages([
                        {
                            id: createMessageId(),
                            type: 'system',
                            content: 'Interview resumed',
                        },
                        ...restoredMessages,
                    ]);
                    setPreparingMic(true);
                    sessionPhaseRef.current = 'active';
                    welcomeSpokenRef.current = true;
                    setIsWelcomeReady(true);
                    setPreparingMic(false);
                    return;
                }

                const [session, speechResponse] = await Promise.all([
                    createInterview({ jobId }),
                    synthesizeSpeech(welcomeText).catch(() => ({
                        audio: null,
                        contentType: null,
                        speechFailed: true,
                    })),
                ]);

                if (!mounted) {
                    return;
                }

                if (
                    !speechResponse.speechFailed &&
                    speechResponse.audio &&
                    speechResponse.contentType
                ) {
                    welcomeSpeechPrefetchRef.current = {
                        audioBase64: speechResponse.audio,
                        contentType: speechResponse.contentType,
                    };
                }

                setInterviewId(session.interviewId);
                setPreparingMic(true);
                sessionPhaseRef.current = 'active';

                appendMessage({
                    id: createMessageId(),
                    type: 'system',
                    content: 'Interview started',
                });
            } catch (error) {
                if (!mounted) {
                    return;
                }

                setInterviewId(null);
                sessionPhaseRef.current = 'none';
                sessionErrorKindRef.current = 'other';

                if (error instanceof ApiError) {
                    setSessionError(error.message);
                } else {
                    setSessionError('Unable to start the interview. Please try again.');
                }
            } finally {
                if (mounted) {
                    setBootstrapping(false);
                }
            }
        };

        void bootstrap();

        return () => {
            mounted = false;
            cancelSpeech();
        };
    }, [
        appendMessage,
        bootstrapAttempt,
        cancelSpeech,
        enabled,
        jobId,
        jobTitle,
        resumeInterviewId,
        role,
        speechSupported,
    ]);

    useEffect(() => {
        if (
            !enabled ||
            !interviewId ||
            sessionPhaseRef.current !== 'active' ||
            welcomeSpokenRef.current
        ) {
            return;
        }

        let mounted = true;
        const welcomeText = formatRoomWelcome({ jobTitle, role });

        const prepareSession = async () => {
            setPreparingMic(true);
            setSessionError(null);

            sessionErrorKindRef.current = 'none';

            const micAccess = await requestMicrophoneAccess();

            if (!mounted) {
                return;
            }

            if (micAccess.granted === false) {
                setPreparingMic(false);
                setSessionError(micAccess.message);

                sessionErrorKindRef.current = 'mic';

                return;
            }

            const welcomePlaybackSucceeded = await playSpokenText(
                welcomeText,
                welcomeSpeechPrefetchRef.current,
            );

            if (!mounted) {
                return;
            }

            appendMessage({
                id: createMessageId(),
                type: 'ai',
                content: welcomeText,
            });

            if (!welcomePlaybackSucceeded) {
                appendSpeechFailureNotice();
            }

            welcomeSpokenRef.current = true;
            setIsWelcomeReady(true);
            setPreparingMic(false);
        };

        void prepareSession();

        return () => {
            mounted = false;
        };
    }, [
        appendMessage,
        appendSpeechFailureNotice,
        enabled,
        interviewId,
        jobTitle,
        playSpokenText,
        prepareAttempt,
        role,
    ]);

    const submitCapturedTurn = useCallback(
        async (capture: AudioCaptureResult, clientTurnId: string) => {
            if (!interviewId || isSubmittingRef.current) {
                return;
            }

            isSubmittingRef.current = true;
            setInterviewState('transcribing');
            setTurnError(null);
            setTurnCanRetry(false);

            const body: SubmitTurnBody = {
                audio: capture.audioBlob,
                startedAt: capture.startedAt,
                endedAt: capture.endedAt,
                clientTurnId,
            };

            try {
                const response = await submitTurnWithRetry(interviewId, body);

                pendingTurnRef.current = null;
                setQuestionCount(response.questionCount);

                appendMessage({
                    id: createMessageId(),
                    type: 'candidate',
                    content: response.text,
                });

                if (response.aiText.trim()) {
                    appendMessage({
                        id: createMessageId(),
                        type: 'ai',
                        content: response.aiText,
                    });

                    const aiSpeechPlayed = await playSpokenText(response.aiText, {
                        audioBase64: response.aiSpeechFailed ? null : response.aiAudio,
                        contentType: response.aiSpeechFailed ? null : response.aiAudioContentType,
                    });

                    if (!aiSpeechPlayed) {
                        appendSpeechFailureNotice();
                    }
                }

                if (response.isFinal) {
                    setIsFinishingInterview(true);
                    setInterviewState('thinking');

                    const goodbyeText = formatRoomGoodbye({ jobTitle });
                    appendMessage({
                        id: createMessageId(),
                        type: 'ai',
                        content: goodbyeText,
                    });

                    const goodbyeSpeechPlayed = await playSpokenText(goodbyeText);

                    if (!goodbyeSpeechPlayed) {
                        appendSpeechFailureNotice();
                    }

                    sessionPhaseRef.current = 'completed';
                    await completeInterviewWithSilentRetry(interviewId);
                    onComplete(interviewId);
                    return;
                }

                setInterviewState('idle');
            } catch (error) {
                if (isFatalTurnError(error)) {
                    pendingTurnRef.current = null;
                    setTurnCanRetry(false);

                    if (error instanceof ApiError) {
                        setSessionError(error.message);
                    } else {
                        setSessionError('This interview session is no longer active.');
                    }

                    return;
                }

                if (isSttTurnError(error)) {
                    pendingTurnRef.current = null;
                    const message = error instanceof ApiError ? error.message : STT_FAILED_MESSAGE;
                    setTurnError(message);
                    setTurnCanRetry(false);
                    setInterviewState('idle');

                    const playback = await speakRef.current(DIDNT_UNDERSTAND_SPEECH);

                    if (playback.speechFailed) {
                        appendSpeechFailureNotice();
                    }

                    return;
                }

                pendingTurnRef.current = { capture, clientTurnId };

                if (error instanceof ApiError) {
                    setTurnError(error.message);
                    setTurnCanRetry(isRetryableSubmitError(error));
                } else {
                    setTurnError(TURN_SUBMIT_RETRY_MESSAGE);
                    setTurnCanRetry(true);
                }

                setInterviewState('idle');
            } finally {
                isSubmittingRef.current = false;
            }
        },
        [
            appendMessage,
            appendSpeechFailureNotice,
            interviewId,
            jobTitle,
            onComplete,
            playSpokenText,
        ],
    );

    const handleSubmitTurn = useCallback(
        async (capture: AudioCaptureResult) => {
            await submitCapturedTurn(capture, crypto.randomUUID());
        },
        [submitCapturedTurn],
    );

    useEffect(() => {
        handleSubmitTurnRef.current = handleSubmitTurn;
    }, [handleSubmitTurn]);

    const retryTurn = useCallback(() => {
        const pending = pendingTurnRef.current;

        if (!pending) {
            return;
        }

        void submitCapturedTurn(pending.capture, pending.clientTurnId);
    }, [submitCapturedTurn]);

    const toggleMic = useCallback(() => {
        if (
            bootstrapping ||
            preparingMic ||
            !isWelcomeReady ||
            isSpeaking ||
            interviewState === 'thinking' ||
            interviewState === 'transcribing' ||
            isSubmittingRef.current
        ) {
            return;
        }

        if (interviewState === 'idle') {
            void (async () => {
                setTurnError(null);
                setTurnCanRetry(false);
                resetCaptureError();

                const started = await startListening();

                if (started) {
                    setInterviewState('listening');
                }
            })();

            return;
        }

        if (interviewState === 'listening') {
            void (async () => {
                const capture = await stopListening();

                if (isCaptureTooShort(capture)) {
                    setInterviewState('idle');
                    await handleUnrecognizedCapture();
                    return;
                }

                setInterviewState('transcribing');
                await handleSubmitTurn(capture!);
            })();
        }
    }, [
        bootstrapping,
        handleSubmitTurn,
        handleUnrecognizedCapture,
        interviewState,
        isSpeaking,
        preparingMic,
        isWelcomeReady,
        resetCaptureError,
        startListening,
        stopListening,
    ]);

    const micDisabled =
        bootstrapping ||
        preparingMic ||
        !isWelcomeReady ||
        isStartingCapture ||
        isSpeaking ||
        isFinishingInterview ||
        interviewState === 'thinking' ||
        interviewState === 'transcribing' ||
        turnCanRetry ||
        !interviewId;

    const leaveDisabled = isFinishingInterview;

    const statusLabel = useMemo(() => {
        if (bootstrapping) {
            return 'Starting';
        }

        if (preparingMic) {
            return 'Preparing';
        }

        if (isFinishingInterview) {
            return isSpeaking ? 'Speaking' : 'Completing';
        }

        if (isSpeaking) {
            return 'Speaking';
        }

        return ROOM_STATE_LABELS[interviewState];
    }, [bootstrapping, interviewState, isFinishingInterview, isSpeaking, preparingMic]);

    return {
        bootstrapping,
        preparingMic,
        sessionError,
        turnError,
        turnCanRetry,
        interviewState,
        messages,
        questionCount,
        isSpeaking,
        isRecording,
        recordingSeconds,
        toggleMic,
        statusLabel,
        micDisabled,
        leaveDisabled,
        retryBootstrap,
        clearTurnError,
        retryTurn,
        abandonSession,
    };
};
