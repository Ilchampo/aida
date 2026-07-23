import React from 'react';

import type { JobData } from '@lib/interfaces/job.interface';
import type { RoomInterviewState } from '@lib/interfaces/room.interface';

import Wordmark from '@components/Common/WordMark';
import RoomStatusBadge from '@components/Room/RoomStatusBadge';

interface RoomHeaderProps {
    job: JobData;
    interviewState: RoomInterviewState;
    statusLabel: string;
    onLeave: VoidFunction;
    leaveDisabled?: boolean;
}

const RoomHeader: React.FC<RoomHeaderProps> = (props) => {
    const { job, interviewState, statusLabel, onLeave, leaveDisabled = false } = props;

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-indigo-500/20 bg-void-900/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-4 overflow-hidden">
                <Wordmark showIcon className="origin-left scale-90" />
                <div className="h-4 w-px bg-indigo-500/30" aria-hidden="true" />
                <div className="flex items-center gap-2 truncate">
                    <span className="truncate font-display text-sm font-semibold uppercase tracking-wide text-slate-100">
                        {job.title}
                    </span>
                    <span className="hidden shrink-0 rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-indigo-300 sm:inline-block">
                        {job.role}
                    </span>
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-3">
                <RoomStatusBadge interviewState={interviewState} statusLabel={statusLabel} />
                <button
                    type="button"
                    onClick={onLeave}
                    disabled={leaveDisabled}
                    className="rounded-md border border-slate-700 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-red-400/50 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Leave
                </button>
            </div>
        </header>
    );
};

export default RoomHeader;
