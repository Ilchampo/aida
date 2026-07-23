import type { InterviewStatus } from '@lib/interfaces/interview.interface';

export const STATUS_STYLES: Record<InterviewStatus, string> = {
    completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    in_progress: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    abandoned: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
} as const;
