import React from 'react';

import type { JobRole, JobAccent } from '@lib/interfaces/job.interface';

import { BriefcaseIcon } from 'lucide-react';

import HudCorners from '@components/Common/HudCorners';

interface JobHeroProps {
    role: JobRole;
    accent: JobAccent;
}

const JobHero: React.FC<JobHeroProps> = (props) => {
    const { role, accent } = props;

    return (
        <div
            className="relative flex h-64 shrink-0 items-center justify-center overflow-hidden bg-void-950 sm:h-80"
            role="img"
            aria-label={`${role} cover image`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-25`}
                aria-hidden="true"
            />
            <svg className="absolute inset-0 h-full w-full text-white/10" aria-hidden="true">
                <defs>
                    <pattern
                        id="hero-grid"
                        x="0"
                        y="0"
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 32 0 L 0 0 0 32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
            <div
                className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-300/20 to-transparent animate-scan"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 bg-gradient-to-t from-void-950 via-transparent to-transparent"
                aria-hidden="true"
            />
            <HudCorners className="absolute inset-4" color="text-cyan-300/60" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-xl border border-cyan-400/40 bg-void-900/60 shadow-glow-cyan backdrop-blur-sm">
                <BriefcaseIcon
                    className="h-10 w-10 text-cyan-300"
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};

export default JobHero;
