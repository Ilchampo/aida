import React from 'react';

import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircleIcon, TrophyIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@hooks/useAuth';
import { useGlobalLeaderboard, useJobLeaderboard } from '@hooks/useLeaderboard';
import { useJobDetail } from '@hooks/useJobDetail';

import PageShell from '@components/Layout/PageShell';
import LoadingPanel from '@components/Feedback/LoadingPanel';
import ErrorPanel from '@components/Feedback/ErrorPanel';
import LeaderboardRow from '@components/Leaderboard/LeaderboardRow';

const LeaderboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get('jobId') ?? undefined;

    const globalBoard = useGlobalLeaderboard();
    const jobBoard = useJobLeaderboard(jobId);
    const { job } = useJobDetail(jobId);

    const active = jobId ? jobBoard : globalBoard;
    const title = jobId ? (job?.title ?? 'Role leaderboard') : 'Global leaderboard';
    const subtitle = jobId
        ? 'Top 10 by best completed score on this role'
        : 'Top 10 by average of each user’s best scores across completed roles';

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
                        {'// scoreboard'}
                    </p>
                    <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-slate-100 sm:text-3xl">
                        {title}
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">{subtitle}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                            to="/leaderboard"
                            className={[
                                'rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition',
                                !jobId
                                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                                    : 'border-slate-700 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300',
                            ].join(' ')}
                        >
                            Global
                        </Link>
                        {jobId && (
                            <span className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                                This role
                            </span>
                        )}
                    </div>
                </div>

                {active.loading ? (
                    <LoadingPanel
                        message={'// computing rankings...'}
                        className="flex flex-col items-center gap-4 rounded-lg border border-indigo-500/25 bg-void-800/40 py-24 text-center backdrop-blur-sm"
                    />
                ) : active.error ? (
                    <div className="flex flex-col items-center gap-4 rounded-lg border border-red-500/30 bg-red-500/5 py-16 text-center">
                        <AlertCircleIcon className="h-8 w-8 text-red-400/80" strokeWidth={1.5} />
                        <ErrorPanel message={active.error} />
                        <button
                            type="button"
                            onClick={active.retry}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-300"
                        >
                            Retry
                        </button>
                    </div>
                ) : active.items.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-indigo-500/25 bg-void-800/40 py-16 text-center">
                        <TrophyIcon className="h-8 w-8 text-slate-600" strokeWidth={1.5} />
                        <p className="font-mono text-sm uppercase tracking-widest text-slate-400">
                            {'// no rankings yet'}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        {jobId
                            ? jobBoard.items.map((entry) => (
                                  <LeaderboardRow
                                      key={entry.userId}
                                      rank={entry.rank}
                                      givenName={entry.givenName}
                                      pictureUrl={entry.pictureUrl}
                                      scoreLabel={`${entry.bestScore} / 100`}
                                  />
                              ))
                            : globalBoard.items.map((entry) => (
                                  <LeaderboardRow
                                      key={entry.userId}
                                      rank={entry.rank}
                                      givenName={entry.givenName}
                                      pictureUrl={entry.pictureUrl}
                                      scoreLabel={`${entry.averageBestScore}`}
                                      meta={`${entry.rolesCounted} role${entry.rolesCounted === 1 ? '' : 's'}`}
                                  />
                              ))}
                    </motion.div>
                )}
            </main>
        </PageShell>
    );
};

export default LeaderboardPage;
