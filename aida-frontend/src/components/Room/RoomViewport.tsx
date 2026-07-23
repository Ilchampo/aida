import React, { useEffect, useRef } from 'react';

import type { JobAccent } from '@lib/interfaces/job.interface';

import { VideoIcon, VideoOffIcon } from 'lucide-react';

import HudCorners from '@components/Common/HudCorners';
import { useCameraPreview } from '@hooks/useCameraPreview';

interface RoomViewportProps {
    accent: JobAccent;
    isSpeaking?: boolean;
}

const RoomViewport: React.FC<RoomViewportProps> = (props) => {
    const { accent, isSpeaking = false } = props;
    const { status, stream, enable, disable } = useCameraPreview();
    const videoRef = useRef<HTMLVideoElement>(null);
    const isLive = status === 'live' && Boolean(stream);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.srcObject = stream;
    }, [stream]);

    const statusLabel = (() => {
        switch (status) {
            case 'live':
                return 'Camera feed // live';
            case 'requesting':
                return 'Camera feed // requesting';
            case 'denied':
                return 'Camera feed // permission denied';
            case 'unavailable':
                return 'Camera feed // unavailable';
            default:
                return 'Camera feed // offline';
        }
    })();

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

                {isLive ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                        aria-label="Your camera preview"
                    />
                ) : (
                    <div className="relative flex flex-col items-center gap-3 text-slate-400">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-void-900/60 backdrop-blur-sm">
                            <VideoOffIcon
                                className="h-8 w-8"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest">
                            {statusLabel}
                        </span>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2 sm:right-auto sm:max-w-sm">
                    <div className="rounded border border-cyan-400/30 bg-void-950/70 px-2.5 py-1.5 backdrop-blur-md">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                            ● {isLive ? 'Camera preview' : 'Camera offline'}
                        </span>
                    </div>
                    <p className="rounded border border-slate-700/80 bg-void-950/70 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-slate-400 backdrop-blur-md">
                        Video is not recorded. Only an audio transcript is saved.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            if (isLive) {
                                disable();
                                return;
                            }

                            void enable();
                        }}
                        disabled={status === 'requesting'}
                        className="inline-flex w-fit items-center gap-1.5 rounded border border-slate-700 bg-void-950/70 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-300 backdrop-blur-md transition hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isLive ? (
                            <>
                                <VideoOffIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                Turn camera off
                            </>
                        ) : (
                            <>
                                <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                {status === 'requesting' ? 'Requesting…' : 'Enable camera'}
                            </>
                        )}
                    </button>
                </div>

                {isSpeaking && (
                    <div className="absolute right-4 top-4 z-10 rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 backdrop-blur-md">
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
