import React from 'react';

import type { JobRole } from '@lib/interfaces/job.interface';
import type { RoomInterviewState, RoomMessage } from '@lib/interfaces/room.interface';

import RoomCommsLog from '@components/Room/RoomCommsLog';
import RoomMicControl from '@components/Room/RoomMicControl';

interface RoomCommsPanelProps {
    messages: RoomMessage[];
    role: JobRole;
    interviewState: RoomInterviewState;
    isSpeaking: boolean;
    isRecording: boolean;
    recordingSeconds: number;
    questionCount: number;
    micDisabled: boolean;
    turnError: string | null;
    turnCanRetry: boolean;
    onToggleMic: VoidFunction;
    onDismissTurnError: VoidFunction;
    onRetryTurn: VoidFunction;
}

const RoomCommsPanel: React.FC<RoomCommsPanelProps> = (props) => {
    const {
        messages,
        role,
        interviewState,
        isSpeaking,
        isRecording,
        recordingSeconds,
        questionCount,
        micDisabled,
        turnError,
        turnCanRetry,
        onToggleMic,
        onDismissTurnError,
        onRetryTurn,
    } = props;

    return (
        <div className="flex h-[40vh] w-full shrink-0 flex-col border-t border-indigo-500/20 bg-void-900/50 backdrop-blur-md lg:h-auto lg:w-[400px] lg:border-t-0 xl:w-[480px]">
            <div className="flex items-center justify-between border-b border-indigo-500/20 px-4 py-3">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                    {'// ai interviewer'}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Q {questionCount}
                </span>
            </div>

            <RoomCommsLog messages={messages} role={role} />
            <RoomMicControl
                interviewState={interviewState}
                isSpeaking={isSpeaking}
                isRecording={isRecording}
                recordingSeconds={recordingSeconds}
                micDisabled={micDisabled}
                turnError={turnError}
                turnCanRetry={turnCanRetry}
                onToggle={onToggleMic}
                onDismissError={onDismissTurnError}
                onRetryTurn={onRetryTurn}
            />
        </div>
    );
};

export default RoomCommsPanel;
