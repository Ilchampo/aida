import React from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginatorProps {
    page: number;
    totalPages: number;
    onPrev: VoidFunction;
    onNext: VoidFunction;
}

const Paginator: React.FC<PaginatorProps> = (props) => {
    const { page, totalPages, onPrev, onNext } = props;

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    const btn =
        'inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-void-900/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:text-slate-300';

    return (
        <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
            <button type="button" onClick={onPrev} disabled={isFirst} className={btn}>
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                Prev
            </button>

            <span
                className="font-mono text-xs uppercase tracking-widest text-cyan-400/80"
                aria-current="page"
            >
                Page {page} / {totalPages}
            </span>

            <button type="button" onClick={onNext} disabled={isLast} className={btn}>
                Next
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
        </nav>
    );
};

export default Paginator;
