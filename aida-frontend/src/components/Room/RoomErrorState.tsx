import React from 'react';

import { AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoomErrorStateProps {
    message: string;
    backTo: string;
    onRetry?: VoidFunction;
}

const RoomErrorState: React.FC<RoomErrorStateProps> = (props) => {
    const { message, backTo, onRetry } = props;

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-void-950 px-4">
            <AlertCircleIcon
                className="h-8 w-8 text-red-400/80"
                strokeWidth={1.5}
                aria-hidden="true"
            />
            <p className="max-w-md text-center font-mono text-sm uppercase tracking-widest text-red-400">
                {message}
            </p>
            <div className="flex items-center gap-3">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-md border border-red-500/40 bg-red-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-300 transition hover:border-red-400/60 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                    >
                        Retry
                    </button>
                )}
                <Link
                    to={backTo}
                    className="rounded-md border border-slate-700 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                >
                    Back to role
                </Link>
            </div>
        </div>
    );
};

export default RoomErrorState;
