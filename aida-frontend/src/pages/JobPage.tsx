import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useActiveInterview } from '@hooks/useActiveInterview';
import { useAuth } from '@hooks/useAuth';
import { useJobDetail } from '@hooks/useJobDetail';
import { accentForIndex } from '@lib/utils/color.util';
import { isJobData } from '@lib/utils/job.util';

import PageShell from '@components/Layout/PageShell';
import LoadingPanel from '@components/Feedback/LoadingPanel';
import ErrorPanel from '@components/Feedback/ErrorPanel';
import BackLink from '@components/Common/BackLink';
import JobHero from '@components/Job/JobHero';
import CandidateBriefingPanel from '@components/Job/CandidateBriefingPanel';

const JobPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const accentIndex = (location.state as { accentIndex?: number } | null)?.accentIndex ?? 0;

    const { job, loading, error, retry } = useJobDetail(jobId);
    const { active } = useActiveInterview(Boolean(jobId));

    const practiceJob = job && isJobData(job) ? job : null;
    const hasActiveElsewhere = Boolean(active && jobId && active.job._id !== jobId);

    const handleStartInterview = useCallback(() => {
        if (!practiceJob) {
            return;
        }

        navigate(`/interview/${practiceJob._id}`);
    }, [navigate, practiceJob]);

    const accent = accentForIndex(accentIndex);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [jobId]);

    return (
        <PageShell
            className="min-h-screen"
            givenName={user?.given_name}
            pictureUrl={user?.picture_url}
            onLogout={() => {
                void logout();
            }}
        >
            <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col px-4 py-8 sm:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <BackLink to="/">Back to roles</BackLink>
                </div>

                {loading ? (
                    <LoadingPanel
                        message={'// retrieving mission brief...'}
                        className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-indigo-500/25 bg-void-800/50 py-24 shadow-glow backdrop-blur-sm"
                    />
                ) : error || !practiceJob ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/25 bg-void-800/50 py-24 shadow-glow backdrop-blur-sm">
                        <AlertCircleIcon
                            className="h-8 w-8 text-red-400/80"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        <ErrorPanel message={error ?? '// error: mission brief not found'} />
                        <button
                            type="button"
                            onClick={retry}
                            className="rounded-md border border-red-500/40 bg-red-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-red-300 transition hover:border-red-400/60 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="flex flex-1 flex-col overflow-hidden rounded-lg border border-indigo-500/25 bg-void-800/50 shadow-glow backdrop-blur-sm"
                    >
                        <JobHero role={practiceJob.role} accent={accent} />

                        <div className="flex flex-col items-start gap-8 p-6 sm:p-8 lg:flex-row">
                            <div className="min-w-0 flex-1">
                                <h1 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-slate-100 sm:text-3xl">
                                    {practiceJob.title}
                                </h1>

                                <div
                                    className="my-6 h-px w-full bg-gradient-to-r from-cyan-400/60 via-indigo-500/30 to-transparent"
                                    aria-hidden="true"
                                />

                                <div className="max-w-none">
                                    <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-400">
                                        {practiceJob.description}
                                    </p>
                                </div>
                            </div>

                            <CandidateBriefingPanel
                                job={practiceJob}
                                onStart={handleStartInterview}
                                hasActiveElsewhere={hasActiveElsewhere}
                            />
                        </div>
                    </motion.div>
                )}
            </main>
        </PageShell>
    );
};

export default JobPage;
