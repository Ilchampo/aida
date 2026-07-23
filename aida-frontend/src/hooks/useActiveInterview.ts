import { useCallback, useEffect, useState } from 'react';

import { getActiveInterview } from '@api/interview.api';
import type { OwnerInterviewDetail } from '@lib/interfaces/interview.interface';
import { ApiError } from '@lib/utils/apiCaller';

interface UseActiveInterviewResult {
    active: OwnerInterviewDetail | null;
    loading: boolean;
    error: string | null;
    retry: VoidFunction;
    refresh: () => Promise<void>;
}

export const useActiveInterview = (enabled = true): UseActiveInterviewResult => {
    const [active, setActive] = useState<OwnerInterviewDetail | null>(null);
    const [prevEnabled, setPrevEnabled] = useState(enabled);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    if (enabled !== prevEnabled) {
        setPrevEnabled(enabled);
        setActive(null);
        setLoading(enabled);
        setError(null);
    }

    const refresh = useCallback(async () => {
        if (!enabled) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getActiveInterview();
            setActive(data);
        } catch (err) {
            setActive(null);
            setError(err instanceof ApiError ? err.message : 'Unable to load active interview');
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getActiveInterview();

                if (!mounted) {
                    return;
                }

                setActive(data);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                setActive(null);
                setError(err instanceof ApiError ? err.message : 'Unable to load active interview');
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
    }, [enabled, retryKey]);

    return {
        active: enabled ? active : null,
        loading: enabled ? loading : false,
        error: enabled ? error : null,
        retry: () => setRetryKey((value) => value + 1),
        refresh,
    };
};
