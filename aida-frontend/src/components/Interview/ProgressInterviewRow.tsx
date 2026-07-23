import React from 'react';

import type { OwnerInterviewListItem } from '@lib/interfaces/interview.interface';

import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { formatDurationFromSeconds } from '@lib/utils/format.util';

interface ProgressInterviewRowProps {
    interview: OwnerInterviewListItem;
}

const ProgressInterviewRow: React.FC<ProgressInterviewRowProps> = (props) => {
    const { interview } = props;
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(`/results/${interview._id}`)}
            className="group w-full rounded-lg border border-slate-700 bg-void-950/40 p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/5 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label={`View results for ${interview.job.title}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate font-medium text-slate-100">{interview.job.title}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                        {interview.job.role}
                    </p>
                </div>
                <span className="shrink-0 font-mono text-sm text-cyan-300">
                    {interview.overallScore !== null ? `${interview.overallScore}` : '—'}
                    <span className="text-slate-500"> / 100</span>
                </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] text-slate-400">
                <div>
                    <span className="block text-slate-500">Questions</span>
                    <span>{interview.questionsAsked}</span>
                </div>
                <div>
                    <span className="block text-slate-500">Duration</span>
                    <span>{formatDurationFromSeconds(interview.duration)}</span>
                </div>
                <div>
                    <span className="block text-slate-500">Completed</span>
                    <span>
                        {interview.endedAt
                            ? new Date(interview.endedAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                              })
                            : '—'}
                    </span>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-1 font-mono text-[9px] uppercase tracking-wider text-cyan-400/60 transition group-hover:text-cyan-300">
                View report
                <ArrowRightIcon
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                />
            </div>
        </button>
    );
};

export default ProgressInterviewRow;
