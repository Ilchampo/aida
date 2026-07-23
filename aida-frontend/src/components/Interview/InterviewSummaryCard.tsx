import React from 'react';

import type { OwnerInterviewDetail } from '@lib/interfaces/interview.interface';

import { ClockIcon, HashIcon } from 'lucide-react';
import { formatDurationBetween } from '@lib/utils/format.util';

import HudCorners from '@components/Common/HudCorners';
import InterviewStatusBadge from '@components/Interview/InterviewStatusBadge';

interface InterviewSummaryCardProps {
    interview: OwnerInterviewDetail;
}

const InterviewSummaryCard: React.FC<InterviewSummaryCardProps> = (props) => {
    const { interview } = props;

    return (
        <div className="relative overflow-hidden rounded-lg border border-indigo-500/25 bg-void-800/50 p-6 shadow-glow backdrop-blur-sm">
            <HudCorners className="absolute inset-3" color="text-cyan-300/40" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/70">
                {'// interview record'}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-wide text-slate-100 sm:text-3xl">
                {interview.job.title}
            </h1>
            <p className="mt-1 font-mono text-sm text-slate-400">{interview.job.role}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400">
                <InterviewStatusBadge status={interview.status} className="px-2 py-1" />
                <span className="inline-flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatDurationBetween(interview.startedAt, interview.endedAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <HashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {interview.questionsAsked} questions
                </span>
                {interview.evaluation && (
                    <span className="inline-flex items-center gap-1.5 text-cyan-300">
                        Score: {interview.evaluation.overallScore} / 100
                    </span>
                )}
            </div>
        </div>
    );
};

export default InterviewSummaryCard;
