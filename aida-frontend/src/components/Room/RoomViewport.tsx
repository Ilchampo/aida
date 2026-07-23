import React from 'react';

import type { JobAccent } from '@lib/interfaces/job.interface';

import { VideoOffIcon } from 'lucide-react';

import HudCorners from '@components/Common/HudCorners';

interface RoomViewportProps {
    accent: JobAccent;
    isSpeaking?: boolean;
}

const RoomViewport: React.FC<RoomViewportProps> = (props) => {
    const { accent, isSpeaking = false } = props;

    return (
        <div className="flex flex-1 flex-col p-4 lg:border-r lg:border-indigo-500/20 lg:p-6">
            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-indigo-500/25 bg-void-950">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-10`}
                    aria-hidden="true"
                />

                <svg
                    className="absolute inset-0 h-full w-full text-white/[0.06]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="viewport-grid"
                            x="0"
                            y="0"
                            width="36"
                            height="36"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 36 0 L 0 0 0 36"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#viewport-grid)" />
                </svg>

                <div
                    className="absolute inset-x-0 top-0 h-20 animate-scan bg-gradient-to-b from-cyan-300/10 to-transparent"
                    aria-hidden="true"
                />

                <HudCorners className="absolute inset-4" color="text-cyan-300/50" />

                <div className="relative flex flex-col items-center gap-3 text-slate-400">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-void-900/60 backdrop-blur-sm">
                        <VideoOffIcon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest">
                        Camera feed // offline
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 rounded border border-cyan-400/30 bg-void-950/70 px-2.5 py-1.5 backdrop-blur-md">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                        ● Camera preview
                    </span>
                </div>

                {isSpeaking && (
                    <div className="absolute bottom-4 right-4 rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 backdrop-blur-md">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300">
                            ◉ Interviewer speaking
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomViewport;
