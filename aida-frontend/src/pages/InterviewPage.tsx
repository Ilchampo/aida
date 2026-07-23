import React, { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/useAuth';
import { useInterviewDetail } from '@hooks/useInterviewDetail';

import PageShell from '@components/Layout/PageShell';
import LoadingPanel from '@components/Feedback/LoadingPanel';
import ErrorPanel from '@components/Feedback/ErrorPanel';
import BackLink from '@components/Common/BackLink';
import InterviewSummaryCard from '@components/Interview/InterviewSummaryCard';
import InterviewEvaluationCard from '@components/Interview/InterviewEvaluationCard';
import InterviewTranscript from '@components/Interview/InterviewTranscript';

const InterviewPage: React.FC = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const { user, logout } = useAuth();

    const { interview, loading, error, retry } = useInterviewDetail(interviewId);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [interviewId]);

    const backTo = interview ? `/jobs/${interview.job._id}` : '/progress';

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
                    <BackLink to={backTo}>Back</BackLink>
                </div>

                {loading ? (
                    <LoadingPanel
                        message={'// loading interview record...'}
                        className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-indigo-500/25 bg-void-800/50 py-24 shadow-glow backdrop-blur-sm"
                    />
                ) : error || !interview ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-red-500/25 bg-void-800/50 py-24 shadow-glow backdrop-blur-sm">
                        <AlertCircleIcon
                            className="h-8 w-8 text-red-400/80"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        <ErrorPanel message={error ?? '// error: interview record not found'} />
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
                        className="flex flex-1 flex-col gap-6"
                    >
                        <InterviewSummaryCard interview={interview} />

                        {interview.evaluation && (
                            <InterviewEvaluationCard evaluation={interview.evaluation} />
                        )}

                        {interview.transcript.length > 0 ? (
                            <InterviewTranscript transcript={interview.transcript} />
                        ) : (
                            <div className="rounded-lg border border-dashed border-indigo-500/25 bg-void-800/40 py-12 text-center backdrop-blur-sm">
                                <p className="font-mono text-sm uppercase tracking-widest text-slate-400">
                                    {'// no transcript available'}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </main>
        </PageShell>
    );
};

export default InterviewPage;
