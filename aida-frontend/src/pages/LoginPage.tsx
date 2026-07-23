import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, Loader2Icon } from 'lucide-react';
import { motion } from 'framer-motion';

import PageShell from '@components/Layout/PageShell';
import Wordmark from '@components/Common/WordMark';
import HudCorners from '@components/Common/HudCorners';
import { useAuth } from '@hooks/useAuth';
import { config } from '@lib/config';
import { ApiError } from '@lib/utils/apiCaller';
import { renderGoogleSignInButton } from '@lib/utils/googleAuth.util';

const MISSING_CLIENT_ID_ERROR = 'Google Sign-In is not configured (missing VITE_GOOGLE_CLIENT_ID).';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();
    const buttonHostRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(() =>
        config.googleClientId ? null : MISSING_CLIENT_ID_ERROR,
    );

    useEffect(() => {
        const host = buttonHostRef.current;

        if (!host || !config.googleClientId) {
            return;
        }

        let cancelled = false;
        let signingIn = false;

        const mountButton = async () => {
            try {
                await renderGoogleSignInButton({
                    parent: host,
                    clientId: config.googleClientId,
                    onCredential: (idToken) => {
                        void (async () => {
                            if (signingIn) {
                                return;
                            }

                            signingIn = true;
                            setError(null);
                            setLoading(true);

                            try {
                                await loginWithGoogle(idToken);
                                navigate('/');
                            } catch (submitError) {
                                if (submitError instanceof ApiError) {
                                    setError(submitError.message);
                                } else {
                                    setError('Unable to sign in with Google. Please try again.');
                                }
                            } finally {
                                signingIn = false;
                                setLoading(false);
                            }
                        })();
                    },
                });
            } catch {
                if (!cancelled) {
                    setError('Unable to load Google Sign-In. Please refresh and try again.');
                }
            }
        };

        void mountButton();

        return () => {
            cancelled = true;
        };
    }, [loginWithGoogle, navigate]);

    return (
        <PageShell className="min-h-full">
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-[400px]"
                >
                    <div className="mb-6 flex justify-center">
                        <Wordmark />
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-indigo-500/25 bg-void-800/60 p-6 shadow-glow backdrop-blur-md sm:p-8">
                        <span
                            className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
                            aria-hidden="true"
                        />

                        <HudCorners className="absolute inset-3" color="text-cyan-400/40" />

                        <div className="mb-6 text-center">
                            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-400/70">
                                {'// secure access'}
                            </p>
                            <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
                                Practice interviews
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-400">
                                Sign in with Google to start preparing
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-5 flex items-start gap-2.5 rounded-md border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-sm text-red-300"
                            >
                                <AlertCircleIcon
                                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="relative flex min-h-[44px] flex-col items-center justify-center">
                            {loading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-void-900/70">
                                    <Loader2Icon
                                        className="h-5 w-5 animate-spin text-cyan-300"
                                        aria-hidden="true"
                                    />
                                    <span className="sr-only">Signing in…</span>
                                </div>
                            )}
                            <div ref={buttonHostRef} className="flex w-full justify-center" />
                        </div>
                    </div>

                    <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-wider text-slate-500">
                        Free practice · up to 6 roles · 3 tries each
                    </p>
                </motion.div>
            </main>
        </PageShell>
    );
};

export default LoginPage;
