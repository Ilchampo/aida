import React, { useState } from 'react';

interface LeaderboardRowProps {
    rank: number;
    givenName: string;
    pictureUrl: string | null;
    scoreLabel: string;
    meta?: string;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = (props) => {
    const { rank, givenName, pictureUrl, scoreLabel, meta } = props;
    const [imageFailed, setImageFailed] = useState(false);
    const initial = givenName.trim().charAt(0).toUpperCase() || 'U';
    const showImage = Boolean(pictureUrl) && !imageFailed;

    return (
        <div className="flex items-center gap-3 rounded-lg border border-slate-700/80 bg-void-950/40 px-4 py-3">
            <span className="w-8 shrink-0 font-mono text-sm text-cyan-300">#{rank}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-display text-sm font-bold text-white">
                {showImage ? (
                    <img
                        src={pictureUrl!}
                        alt=""
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    initial
                )}
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-100">{givenName}</p>
                {meta && (
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {meta}
                    </p>
                )}
            </div>
            <span className="shrink-0 font-mono text-sm text-cyan-300">{scoreLabel}</span>
        </div>
    );
};

export default LeaderboardRow;
