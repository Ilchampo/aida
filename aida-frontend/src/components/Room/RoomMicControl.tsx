import React from 'react';

import type { RoomInterviewState } from '@lib/interfaces/room.interface';

import { Loader2Icon, MicIcon, Volume2Icon } from 'lucide-react';
import { formatRecordingTimer } from '@lib/constants/room.constants';

import ErrorPanel from '@components/Feedback/ErrorPanel';

interface RoomMicControlProps {
    interviewState: RoomInterviewState;
    isSpeaking: boolean;
    isRecording: boolean;
    recordingSeconds: number;
    micDisabled: boolean;
    turnError: string | null;
    turnCanRetry: boolean;
    onToggle: VoidFunction;
    onDismissError: VoidFunction;
    onRetryTurn: VoidFunction;
}

const MIC_LABELS: Record<RoomInterviewState, string> = {
    idle: 'Tap to answer',
    listening: 'Listening… speak now',
    transcribing: 'Transcribing your answer…',
    thinking: 'Interviewer is thinking…',
};

const MIC_ARIA_LABELS: Record<RoomInterviewState, string> = {
    idle: 'Tap to answer',
    listening: 'Listening, tap to stop',
    transcribing: 'Transcribing your answer',
    thinking: 'Interviewer is thinking',
};

const RecordPulseRings: React.FC = () => (
    <>
        <span
            className="record-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-emerald-400/80"
            aria-hidden="true"
        />
        <span
            className="record-pulse-ring-delayed pointer-events-none absolute inset-0 rounded-full bg-emerald-400/80"
            aria-hidden="true"
        />
    </>
);

const SpeakPulseRings: React.FC = () => (
    <>
        <span
            className="speak-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-amber-400/70"
            aria-hidden="true"
        />
        <span
            className="speak-pulse-ring-delayed pointer-events-none absolute inset-0 rounded-full bg-amber-400/70"
            aria-hidden="true"
        />
    </>
);

const RoomMicControl: React.FC<RoomMicControlProps> = (props) => {
    const {
        interviewState,
        isSpeaking,
        isRecording,
        recordingSeconds,
        micDisabled,
        turnError,
        turnCanRetry,
        onToggle,
        onDismissError,
        onRetryTurn,
    } = props;

    const isIdle = interviewState === 'idle' && !isSpeaking && !isRecording;
    const isReady = isIdle && !micDisabled;
    const isWaiting = isIdle && micDisabled;
    const isListening = isRecording;
    const isBusy = interviewState === 'thinking' || interviewState === 'transcribing' || isSpeaking;

    const statusLabel = isWaiting
        ? 'Waiting for interviewer…'
        : isSpeaking
          ? 'Interviewer speaking…'
          : MIC_LABELS[interviewState];

    const buttonShellClass = (() => {
        if (isReady) {
            return 'border-cyan-400/50 bg-gradient-to-br from-indigo-600 to-violet-600 shadow-glow transition-all duration-200 group-enabled:hover:brightness-110 group-enabled:hover:shadow-glow-cyan group-enabled:hover:border-cyan-300/70';
        }

        if (isWaiting) {
            return 'animate-mic-waiting border-slate-600/40 bg-void-800/90 shadow-none';
        }

        if (isListening) {
            return 'border-emerald-300/60 bg-emerald-500 shadow-glow-cyan transition-colors duration-200 group-enabled:hover:bg-emerald-600';
        }

        if (isSpeaking) {
            return 'cursor-not-allowed border-amber-400/50 bg-amber-500/20';
        }

        return 'cursor-not-allowed border-amber-400/30 bg-void-800/80 opacity-80';
    })();

    const statusTextClass = (() => {
        if (isReady) {
            return 'text-cyan-300';
        }

        if (isWaiting) {
            return 'text-slate-500';
        }

        if (isListening) {
            return 'text-emerald-300';
        }

        return 'text-amber-300';
    })();

    return (
        <div className="border-t border-indigo-500/20 bg-void-900/60 p-6">
            {turnError && (
                <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2">
                    <ErrorPanel message={turnError} className="leading-relaxed" />
                    <div className="mt-2 flex items-center justify-end gap-3">
                        {turnCanRetry && (
                            <button
                                type="button"
                                onClick={onRetryTurn}
                                className="font-mono text-[10px] font-semibold uppercase tracking-wider text-red-200 hover:text-red-100"
                            >
                                Retry
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onDismissError}
                            className="font-mono text-[10px] uppercase tracking-wider text-red-300/80 hover:text-red-200"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={onToggle}
                    disabled={micDisabled}
                    className="group relative h-16 w-16 focus:outline-none enabled:cursor-pointer disabled:cursor-not-allowed"
                    aria-label={
                        isSpeaking ? 'Interviewer speaking' : MIC_ARIA_LABELS[interviewState]
                    }
                >
                    {isListening && <RecordPulseRings />}
                    {isSpeaking && <SpeakPulseRings />}
                    <div
                        className={`relative flex h-full w-full items-center justify-center rounded-full border ${buttonShellClass}`}
                    >
                        {isBusy ? (
                            <Loader2Icon
                                className="h-6 w-6 animate-spin text-amber-400"
                                aria-hidden="true"
                            />
                        ) : isListening ? (
                            <span
                                className="font-mono text-sm font-bold tabular-nums text-white"
                                aria-live="polite"
                            >
                                {formatRecordingTimer(recordingSeconds)}
                            </span>
                        ) : isSpeaking ? (
                            <Volume2Icon className="h-6 w-6 text-amber-300" aria-hidden="true" />
                        ) : (
                            <MicIcon
                                className={`h-6 w-6 ${isReady ? 'text-white' : 'text-slate-500'}`}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                </button>

                <span
                    className={`font-mono text-xs font-semibold uppercase tracking-widest ${statusTextClass}`}
                >
                    {statusLabel}
                </span>
            </div>
        </div>
    );
};

export default RoomMicControl;
