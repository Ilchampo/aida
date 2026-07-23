import React from 'react';

import type { InterviewEvaluationDetail } from '@lib/interfaces/interview.interface';

interface InterviewEvaluationCardProps {
    evaluation: InterviewEvaluationDetail;
}

const InterviewEvaluationCard: React.FC<InterviewEvaluationCardProps> = (props) => {
    const { evaluation } = props;

    return (
        <div className="relative overflow-hidden rounded-lg border border-indigo-500/25 bg-void-800/50 p-6 shadow-glow backdrop-blur-sm">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-slate-100">
                Evaluation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{evaluation.summary}</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {evaluation.perSkill.map((s) => (
                    <div
                        key={s.skill}
                        className="rounded border border-slate-700 bg-void-950/40 p-3"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-400/90">
                                {s.skill}
                            </h3>
                            <span className="font-mono text-xs text-cyan-300">{s.score}</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-void-950">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                style={{
                                    width: `${s.score}%`,
                                }}
                            />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.evidence}</p>
                    </div>
                ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">
                        {'// strengths'}
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                        {evaluation.strengths.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
                        {'// concerns'}
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                        {evaluation.concerns.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400/60" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InterviewEvaluationCard;
