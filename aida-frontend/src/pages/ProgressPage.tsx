import React from 'react';

import { useSearchParams } from 'react-router-dom';
import { AlertCircleIcon, HistoryIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@hooks/useAuth';
import { useMyInterviews } from '@hooks/useMyInterviews';

import PageShell from '@components/Layout/PageShell';
import LoadingPanel from '@components/Feedback/LoadingPanel';
import ErrorPanel from '@components/Feedback/ErrorPanel';
import Paginator from '@components/Common/Paginator';
import ProgressInterviewRow from '@components/Interview/ProgressInterviewRow';

const ProgressPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get('jobId') ?? undefined;

    const {
        items,
        page,
        totalPages,
        totalItems,
        loading,
        error,
        goToPrevPage,
        goToNextPage,
        retry,
    } = useMyInterviews({ jobId });

    return (
        <PageShell
            className="min-h-screen"
            givenName={user?.given_name}
            pictureUrl={user?.picture_url}
            onLogout={() => {
                void logout();
            }}
        >
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400/70">
                        {'// progression'}
                    </p>
                    <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-slate-100 sm:text-3xl">
                        Your interviews
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Completed attempts only — track score improvements across retries.
                    </p>
                </div>

                {loading ? (
                    <LoadingPanel
                        message={'// loading progression...'}
                        className="flex flex-col items-center gap-4 rounded-lg border border-indigo-500/25 bg-void-800/40 py-24 text-center backdrop-blur-sm"
                    />
                ) : error ? (
                    <div className="flex flex-col items-center gap-4 rounded-lg border border-red-500/30 bg-red-500/5 py-16 text-center">
                        <AlertCircleIcon className="h-8 w-8 text-red-400/80" strokeWidth={1.5} />
                        <ErrorPanel message={error} />
                        <button
                            type="button"
                            onClick={retry}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-300"
                        >
                            Retry
                        </button>
                    </div>
                ) : totalItems === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-indigo-500/25 bg-void-800/40 py-16 text-center">
                        <HistoryIcon className="h-8 w-8 text-slate-600" strokeWidth={1.5} />
                        <p className="font-mono text-sm uppercase tracking-widest text-slate-400">
                            {'// no completed interviews yet'}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        {items.map((interview) => (
                            <ProgressInterviewRow key={interview._id} interview={interview} />
                        ))}

                        {totalPages > 1 && (
                            <Paginator
                                page={page}
                                totalPages={totalPages}
                                onPrev={goToPrevPage}
                                onNext={goToNextPage}
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </PageShell>
    );
};

export default ProgressPage;
