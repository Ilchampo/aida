import { useCallback, useEffect, useState } from 'react';

import { listJobs } from '@api/job.api';
import type { JobListingItem } from '@lib/interfaces/job.interface';
import { JOBS_PAGE_SIZE } from '@lib/constants/jobs.constants';
import { ApiError } from '@lib/utils/apiCaller';

interface UseJobListingResult {
    query: string;
    items: JobListingItem[];
    page: number;
    totalPages: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
    setQuery: (value: string) => void;
    clearQuery: VoidFunction;
    goToPrevPage: VoidFunction;
    goToNextPage: VoidFunction;
    retry: VoidFunction;
}

export const useJobListing = (): UseJobListingResult => {
    const [query, setQueryState] = useState('');
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<JobListingItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    const setQuery = useCallback((value: string) => {
        setQueryState(value);
        setPage(1);
    }, []);

    const clearQuery = useCallback(() => {
        setQueryState('');
        setPage(1);
    }, []);

    const goToPrevPage = useCallback(() => {
        setPage((current) => Math.max(1, current - 1));
    }, []);

    const goToNextPage = useCallback(() => {
        setPage((current) => Math.min(totalPages, current + 1));
    }, [totalPages]);

    const retry = useCallback(() => {
        setRetryKey((key) => key + 1);
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetchJobs = async () => {
            setLoading(true);
            setError(null);

            try {
                const title = query.trim();
                const data = await listJobs({
                    ...(title ? { title } : {}),
                    page,
                    limit: JOBS_PAGE_SIZE,
                });

                if (!mounted) {
                    return;
                }

                setItems(data.items);
                setTotalPages(data.totalPages);
                setTotalItems(data.totalItems);
                setPage(data.page);
            } catch (fetchError) {
                if (!mounted) {
                    return;
                }

                setItems([]);
                setTotalPages(1);
                setTotalItems(0);

                if (fetchError instanceof ApiError) {
                    setError(fetchError.message);
                } else {
                    setError('Unable to load roles. Please try again.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void fetchJobs();

        return () => {
            mounted = false;
        };
    }, [query, page, retryKey]);

    return {
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
    };
};
