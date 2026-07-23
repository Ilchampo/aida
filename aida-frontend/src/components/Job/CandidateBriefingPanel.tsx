import React from 'react';

import type { JobData } from '@lib/interfaces/job.interface';

import { ArrowRightIcon, ChartColumnIcon, CheckCircle2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

import HudCorners from '@components/Common/HudCorners';

interface CandidateBriefingPanelProps {
    job: JobData;
    onStart: VoidFunction;
    hasActiveElsewhere?: boolean;
}

const CandidateBriefingPanel: React.FC<CandidateBriefingPanelProps> = (props) => {
    const { job, onStart, hasActiveElsewhere = false } = props;
    const { practice } = job;
    const canStart = practice.remainingAttempts > 0 && !hasActiveElsewhere;

    return (
        <aside className="w-full shrink-0 lg:w-[300px]">
            <div className="relative flex h-full flex-col gap-6 rounded-lg border border-indigo-500/25 bg-void-900/50 p-5">
                <HudCorners className="absolute inset-2" color="text-indigo-400/40" />
                <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">
                        {'// role'}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-indigo-300">
                            {job.role}
                        </span>
                    </div>
                </div>

                <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">
                        {'// skills'}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-slate-700 bg-void-950/60 px-3 py-1 font-mono text-[11px] text-slate-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">
                        {'// practice'}
                    </h2>
                    <dl className="mt-2 space-y-2 font-mono text-xs text-slate-300">
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Completed</dt>
                            <dd>{practice.completedAttempts} / 3</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Remaining</dt>
                            <dd
                                className={practice.remainingAttempts === 0 ? 'text-amber-300' : ''}
                            >
                                {practice.remainingAttempts}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Best score</dt>
                            <dd className="text-cyan-300">
                                {practice.bestScore !== null ? `${practice.bestScore} / 100` : '—'}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-auto space-y-3 border-t border-indigo-500/20 pt-5">
                    <Link
                        to={`/leaderboard?jobId=${job._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 bg-void-950/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                        <ChartColumnIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Role leaderboard
                    </Link>

                    {practice.remainingAttempts === 0 ? (
                        <div className="flex w-full items-center justify-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-emerald-300">
                            <CheckCircle2Icon className="h-5 w-5" aria-hidden="true" />
                            Tries complete
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onStart}
                                disabled={!canStart}
                                className="group flex w-full items-center justify-center gap-2 rounded-md border border-cyan-400/40 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-void-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {practice.claimed ? 'Retry interview' : 'Start interview'}
                                <ArrowRightIcon
                                    className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </button>
                            <p className="text-center font-mono text-[11px] text-slate-500">
                                {hasActiveElsewhere
                                    ? 'Finish or abandon your active interview first.'
                                    : 'Microphone required. Voice-driven session.'}
                            </p>
                        </>
                    )}

                    {practice.completedAttempts > 0 && (
                        <Link
                            to={`/progress?jobId=${job._id}`}
                            className="block text-center font-mono text-[11px] uppercase tracking-wider text-cyan-400/70 transition hover:text-cyan-300"
                        >
                            View progression
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default CandidateBriefingPanel;
