import React from 'react';

import { Link } from 'react-router-dom';

interface RoomAppliedStateProps {
    backTo: string;
    message?: string;
}

const RoomAppliedState: React.FC<RoomAppliedStateProps> = (props) => {
    const { backTo, message = '// no remaining tries for this role' } = props;

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-void-950 px-4">
            <p className="max-w-md text-center font-mono text-sm uppercase tracking-widest text-emerald-300">
                {message}
            </p>
            <Link
                to={backTo}
                className="rounded-md border border-slate-700 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            >
                Back to role
            </Link>
        </div>
    );
};

export default RoomAppliedState;
