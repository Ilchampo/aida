import React from 'react';

interface DecorativeBackgroundProps {
    className?: string;
}

const DecorativeBackground: React.FC<DecorativeBackgroundProps> = (props) => {
    const { className = '' } = props;

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void-950 ${className}`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,41,59,0.55),_transparent_60%)]" />
            <svg
                className="absolute inset-0 h-full w-full text-indigo-500/20 animate-grid-pulse"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="grid"
                        x="0"
                        y="0"
                        width="44"
                        height="44"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 44 0 L 0 0 0 44"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-indigo-600/20 blur-3xl animate-drift" />
            <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl animate-drift-slow" />
            <div className="absolute -bottom-40 left-1/3 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600/15 blur-3xl animate-drift" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(5,7,15,0.85))]" />
        </div>
    );
};

export default DecorativeBackground;
