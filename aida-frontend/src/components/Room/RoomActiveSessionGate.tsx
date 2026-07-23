import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';

import type { OwnerInterviewDetail } from '@lib/interfaces/interview.interface';
import { abandonInterview } from '@api/interview.api';
import { ApiError } from '@lib/utils/apiCaller';

interface RoomActiveSessionGateProps {
    active: OwnerInterviewDetail;
    currentJobId: string;
    onAbandoned: VoidFunction;
}

const RoomActiveSessionGate: React.FC<RoomActiveSessionGateProps> = (props) => {
    const { active, currentJobId, onAbandoned } = props;
    const [abandoning, setAbandoning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSameJob = active.job._id === currentJobId;

    const handleAbandon = async () => {
        if (abandoning) {
            return;
        }

        setAbandoning(true);
        setError(null);

        try {
            await abandonInterview(active._id);
            onAbandoned();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to abandon interview');
            setAbandoning(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-void-950 px-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400/70">
                {'// session lock'}
            </p>
            <h1 className="max-w-lg text-center font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
                Interview already in progress
            </h1>
            <p className="max-w-md text-center text-sm text-slate-400">
                {isSameJob
                    ? 'You have an unfinished session for this role. Resume to continue, or abandon to start fresh.'
                    : `You already have an open session for “${active.job.title}”. Resume that session or abandon it before starting another.`}
            </p>

            {error && (
                <p className="max-w-md text-center font-mono text-xs text-red-300" role="alert">
                    {error}
                </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                    to={`/interview/${active.job._id}`}
                    className="rounded-md border border-cyan-400/40 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-glow transition hover:brightness-110"
                >
                    Resume session
                </Link>
                <button
                    type="button"
                    onClick={() => {
                        void handleAbandon();
                    }}
                    disabled={abandoning}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"
                >
                    {abandoning && <Loader2Icon className="h-3.5 w-3.5 animate-spin" />}
                    Abandon session
                </button>
            </div>
        </div>
    );
};

export default RoomActiveSessionGate;
