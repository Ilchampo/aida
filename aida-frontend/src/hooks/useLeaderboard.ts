import { useCallback, useEffect, useState } from 'react';

import { getGlobalLeaderboard, getJobLeaderboard } from '@api/leaderboard.api';
import type {
    GlobalLeaderboardEntry,
    JobLeaderboardEntry,
} from '@lib/interfaces/leaderboard.interface';
import { ApiError } from '@lib/utils/apiCaller';

interface UseGlobalLeaderboardResult {
    items: GlobalLeaderboardEntry[];
    loading: boolean;
    error: string | null;
    retry: VoidFunction;
}

export const useGlobalLeaderboard = (): UseGlobalLeaderboardResult => {
    const [items, setItems] = useState<GlobalLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    const retry = useCallback(() => {
        setRetryKey((value) => value + 1);
    }, []);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getGlobalLeaderboard();

                if (!mounted) {
                    return;
                }

                setItems(data.items);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                setItems([]);
                setError(err instanceof ApiError ? err.message : 'Unable to load leaderboard');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            mounted = false;
        };
    }, [retryKey]);

    return {
        items,
        loading,
        error,
        retry,
    };
};

interface UseJobLeaderboardResult {
    items: JobLeaderboardEntry[];
    loading: boolean;
    error: string | null;
    retry: VoidFunction;
}

export const useJobLeaderboard = (jobId: string | undefined): UseJobLeaderboardResult => {
    const [items, setItems] = useState<JobLeaderboardEntry[]>([]);
    const [prevJobId, setPrevJobId] = useState(jobId);
    const [loading, setLoading] = useState(Boolean(jobId));
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    if (jobId !== prevJobId) {
        setPrevJobId(jobId);
        setItems([]);
        setLoading(Boolean(jobId));
        setError(null);
    }

    const retry = useCallback(() => {
        setRetryKey((value) => value + 1);
    }, []);

    useEffect(() => {
        if (!jobId) {
            return;
        }

        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getJobLeaderboard(jobId);

                if (!mounted) {
                    return;
                }

                setItems(data.items);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                setItems([]);
                setError(err instanceof ApiError ? err.message : 'Unable to load leaderboard');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            mounted = false;
        };
    }, [jobId, retryKey]);

    return {
        items: jobId ? items : [],
        loading: jobId ? loading : false,
        error: jobId ? error : null,
        retry,
    };
};
