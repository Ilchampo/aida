import React from 'react';

import { MonitorOffIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SPEECH_UNSUPPORTED_MESSAGE } from '@lib/constants/room.constants';

interface RoomUnsupportedBrowserProps {
    backTo: string;
}

const RoomUnsupportedBrowser: React.FC<RoomUnsupportedBrowserProps> = (props) => {
    const { backTo } = props;

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-void-950 px-4">
            <MonitorOffIcon
                className="h-8 w-8 text-amber-400/80"
                strokeWidth={1.5}
                aria-hidden="true"
            />
            <p className="max-w-md text-center font-mono text-sm uppercase tracking-widest text-amber-300">
                {SPEECH_UNSUPPORTED_MESSAGE}
            </p>
            <p className="max-w-md text-center font-mono text-xs leading-relaxed text-slate-400">
                Use a browser that supports microphone recording and audio playback to continue.
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

export default RoomUnsupportedBrowser;
