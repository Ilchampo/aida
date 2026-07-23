import React from 'react';

import { AlertCircleIcon, SatelliteDishIcon } from 'lucide-react';

import { useAuth } from '@hooks/useAuth';
import { useJobListing } from '@hooks/useJobListing';
import { accentForIndex } from '@lib/utils/color.util';
import { JOBS_PAGE_SIZE } from '@lib/constants/jobs.constants';

import PageShell from '@components/Layout/PageShell';
import LoadingPanel from '@components/Feedback/LoadingPanel';
import ErrorPanel from '@components/Feedback/ErrorPanel';
import JobCard from '@components/Job/JobCard';
import JobFilterBar from '@components/Job/JobFilterBar';
import Paginator from '@components/Common/Paginator';

const HomePage: React.FC = () => {
    const { user, logout } = useAuth();

    const {
        query,
        items,
        page,
        totalPages,
        totalItems,
        loading,
        error,
        setQuery,
        clearQuery,
        goToPrevPage,
        goToNextPage,
        retry,
    } = useJobListing();

    const accentOffset = (page - 1) * JOBS_PAGE_SIZE;
    const quota = user && 'quota' in user ? user.quota : null;

    return (
        <PageShell
            className="min-h-screen"
            givenName={user?.given_name}
            pictureUrl={user?.picture_url}
            onLogout={() => {
                void logout();
            }}
        >
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400/70">
                            {'// select a role to initiate interview'}
                        </p>
                        <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-slate-100 sm:text-3xl">
                            Available Roles
                        </h1>
                    </div>
                    {quota && (
                        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                            Roles used{' '}
                            <span className="text-cyan-300">
                                {quota.distinctRolesUsed}/{quota.distinctRolesLimit}
                            </span>
                        </p>
                    )}
                </div>

                <JobFilterBar
                    value={query}
                    onChange={setQuery}
                    onClear={clearQuery}
                    resultCount={totalItems}
                />

                {loading ? (
                    <LoadingPanel
                        message={'// establishing connection...'}
                        className="flex flex-col items-center gap-4 rounded-lg border border-indigo-500/25 bg-void-800/40 py-24 text-center backdrop-blur-sm"
                    />
                ) : error ? (
                    <div className="flex flex-col items-center gap-4 rounded-lg border border-red-500/30 bg-red-500/5 py-16 text-center backdrop-blur-sm">
                        <AlertCircleIcon
                            className="h-8 w-8 text-red-400/80"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        <ErrorPanel message={error} />
                        <button
                            type="button"
                            onClick={retry}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-300 transition hover:border-red-400/60 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                        >
                            Retry
                        </button>
                    </div>
                ) : totalItems === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-indigo-500/25 bg-void-800/40 py-16 text-center backdrop-blur-sm">
                        <SatelliteDishIcon
                            className="h-8 w-8 text-slate-600"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        <p className="font-mono text-sm uppercase tracking-widest text-slate-400">
                            {query.trim()
                                ? '// no signal — no roles found'
                                : '// no roles available'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((job, index) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    accent={accentForIndex(accentOffset + index)}
                                    accentIndex={accentOffset + index}
                                    index={index}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Paginator
                                page={page}
                                totalPages={totalPages}
                                onPrev={goToPrevPage}
                                onNext={goToNextPage}
                            />
                        )}
                    </>
                )}
            </main>
        </PageShell>
    );
};

export default HomePage;
