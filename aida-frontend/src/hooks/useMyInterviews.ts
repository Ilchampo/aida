import { useCallback, useEffect, useState } from 'react';

import { listMyInterviews } from '@api/interview.api';
import type { OwnerInterviewListItem } from '@lib/interfaces/interview.interface';
import { INTERVIEWS_PAGE_SIZE } from '@lib/constants/interviews.constants';
import { ApiError } from '@lib/utils/apiCaller';

interface UseMyInterviewsParams {
    jobId?: string;
    enabled?: boolean;
}

interface UseMyInterviewsResult {
    items: OwnerInterviewListItem[];
    page: number;
    totalPages: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
    goToPrevPage: VoidFunction;
    goToNextPage: VoidFunction;
    retry: VoidFunction;
}

export const useMyInterviews = (params: UseMyInterviewsParams = {}): UseMyInterviewsResult => {
    const { jobId, enabled = true } = params;

    const [items, setItems] = useState<OwnerInterviewListItem[]>([]);
    const [page, setPage] = useState(1);
    const [prevJobId, setPrevJobId] = useState(jobId);
    const [prevEnabled, setPrevEnabled] = useState(enabled);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    if (jobId !== prevJobId) {
        setPrevJobId(jobId);
        setPage(1);
    }

    if (enabled !== prevEnabled) {
        setPrevEnabled(enabled);
        setItems([]);
        setTotalPages(1);
        setTotalItems(0);
        setLoading(enabled);
        setError(null);
    }

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await listMyInterviews({
                    page,
                    limit: INTERVIEWS_PAGE_SIZE,
                    ...(jobId ? { jobId } : {}),
                });

                if (!mounted) {
                    return;
                }

                setItems(data.items);
                setTotalPages(data.totalPages);
                setTotalItems(data.totalItems);
            } catch (err) {
                if (!mounted) {
                    return;
                }

                setItems([]);
                setError(err instanceof ApiError ? err.message : 'Unable to load progression');
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
    }, [enabled, jobId, page, retryKey]);

    const goToPrevPage = useCallback(() => {
        setPage((current) => Math.max(1, current - 1));
    }, []);

    const goToNextPage = useCallback(() => {
        setPage((current) => Math.min(totalPages, current + 1));
    }, [totalPages]);

    const retry = useCallback(() => {
        setRetryKey((value) => value + 1);
    }, []);

    return {
        items: enabled ? items : [],
        page,
        totalPages: enabled ? totalPages : 1,
        totalItems: enabled ? totalItems : 0,
        loading: enabled ? loading : false,
        error: enabled ? error : null,
        goToPrevPage,
        goToNextPage,
        retry,
    };
};
