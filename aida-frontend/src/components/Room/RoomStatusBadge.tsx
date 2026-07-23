import React from 'react';

import type { RoomInterviewState } from '@lib/interfaces/room.interface';

interface RoomStatusBadgeProps {
    interviewState: RoomInterviewState;
    statusLabel: string;
}

const RoomStatusBadge: React.FC<RoomStatusBadgeProps> = (props) => {
    const { interviewState, statusLabel } = props;

    const isThinking =
        interviewState === 'thinking' ||
        interviewState === 'transcribing' ||
        statusLabel === 'Speaking';

    const isListening = interviewState === 'listening';

    return (
        <div
            className={`flex items-center gap-2 rounded-full border px-2.5 py-1 ${isThinking ? 'border-amber-400/40 bg-amber-400/10' : 'border-emerald-400/40 bg-emerald-400/10'}`}
        >
            <div className="relative flex h-2.5 w-2.5">
                {isListening && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isThinking ? 'bg-amber-400' : 'bg-emerald-400'}`}
                />
            </div>
            <span
                className={`hidden font-mono text-[11px] font-semibold uppercase tracking-widest sm:inline-block ${isThinking ? 'text-amber-300' : 'text-emerald-300'}`}
            >
                {statusLabel}
            </span>
        </div>
    );
};

export default RoomStatusBadge;
