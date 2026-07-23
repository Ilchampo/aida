import React from 'react';

import { MicIcon } from 'lucide-react';

interface WordmarkProps {
    showIcon?: boolean;
    className?: string;
}

const Wordmark: React.FC<WordmarkProps> = (props) => {
    const { showIcon = true, className = '' } = props;

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {showIcon && (
                <span
                    className="relative flex h-8 w-8 items-center justify-center rounded-md border border-cyan-400/40 bg-cyan-500/10 shadow-glow-cyan"
                    aria-hidden="true"
                >
                    <MicIcon className="h-4 w-4 text-cyan-300" strokeWidth={2.25} />
                </span>
            )}
            <span className="font-display text-lg font-bold uppercase tracking-[0.15em] text-slate-100">
                AI
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                    DA
                </span>
            </span>
        </div>
    );
};

export default Wordmark;
