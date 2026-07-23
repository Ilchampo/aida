import React from 'react';

import type { JobListingItem, JobAccent } from '@lib/interfaces/job.interface';

import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

import HudCorners from '@components/Common/HudCorners';

interface JobCardProps {
    job: JobListingItem;
    accent: JobAccent;
    accentIndex: number;
    index?: number;
}

const MAX_VISIBLE_TAGS = 4 as const;

const JobCard: React.FC<JobCardProps> = (props) => {
    const { job, accent, accentIndex, index = 0 } = props;

    const visibleTags = job.tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
    const overflow = (job.tags?.length ?? 0) - visibleTags.length;
    const animationDelay = `${Math.min(index * 0.06, 0.5)}s`;

    return (
        <Link
            to={`/jobs/${job._id}`}
            state={{ accentIndex }}
            style={{ animationDelay }}
            aria-label={`View role: ${job.title}`}
            className="animate-card-fade-in group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-indigo-500/20 bg-void-800 p-5 pt-6 opacity-0 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
            <span
                className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent.gradient}`}
                aria-hidden="true"
            />
            <span
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${accent.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
                aria-hidden="true"
            />
            <HudCorners className="absolute inset-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <h2 className="font-display text-base font-bold uppercase leading-snug tracking-wide text-slate-100">
                {job.title}
            </h2>
            <div className="mt-2.5">
                <span className="inline-flex items-center rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-indigo-300">
                    {job.role}
                </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
                {visibleTags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-slate-700 bg-void-900/60 px-2.5 py-0.5 font-mono text-[11px] text-slate-400"
                    >
                        {tag}
                    </span>
                ))}
                {overflow > 0 && (
                    <span className="rounded-full border border-slate-700 bg-void-900/60 px-2.5 py-0.5 font-mono text-[11px] text-slate-500">
                        +{overflow}
                    </span>
                )}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{job.description}</p>
            <div className="mt-4 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300 transition-all group-hover:gap-2.5">
                View role
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </div>
        </Link>
    );
};

export default JobCard;
