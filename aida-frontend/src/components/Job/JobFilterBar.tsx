import React from 'react';

import type { SubmitEvent } from 'react';

import { useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

interface JobFilterBarProps {
    value: string;
    onChange: (value: string) => void;
    onClear: VoidFunction;
    resultCount: number;
}

const JobFilterBar: React.FC<JobFilterBarProps> = (props) => {
    const { value, onChange, onClear, resultCount } = props;

    const [draft, setDraft] = useState(value);
    const [prevCommittedValue, setPrevCommittedValue] = useState(value);

    if (value !== prevCommittedValue) {
        setPrevCommittedValue(value);
        setDraft(value);
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        onChange(draft);
    };

    const handleClear = () => {
        setDraft('');
        onClear();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-lg border border-indigo-500/20 bg-void-800/50 p-4 backdrop-blur-sm"
        >
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">
                {'// scan · filter roles'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <SearchIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400/60"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Query by title…"
                        aria-label="Filter roles by title"
                        className="w-full rounded-md border border-slate-700 bg-void-950/60 py-2.5 pl-9 pr-3 font-mono text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-cyan-400/40 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-glow transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                    <SearchIcon className="h-4 w-4" aria-hidden="true" />
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={draft.trim() === '' && value.trim() === ''}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-700 bg-void-900/60 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                    Clear
                </button>
            </div>
            {value.trim() !== '' && (
                <p className="mt-2.5 font-mono text-[11px] text-slate-500" aria-live="polite">
                    {resultCount} {resultCount === 1 ? 'match' : 'matches'} for “{value.trim()}”
                </p>
            )}
        </form>
    );
};

export default JobFilterBar;
