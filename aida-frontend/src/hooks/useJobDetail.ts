import { useCallback, useEffect, useState } from 'react';

import { getJobById } from '@api/job.api';
import type { GetJobByIdResponse } from '@lib/interfaces/job.interface';
import { ApiError } from '@lib/utils/apiCaller';

interface UseJobDetailResult {
    job: GetJobByIdResponse | null;
    loading: boolean;
    error: string | null;
    retry: VoidFunction;
}

export const useJobDetail = (jobId: string | undefined): UseJobDetailResult => {
    const [job, setJob] = useState<GetJobByIdResponse | null>(null);
    const [prevJobId, setPrevJobId] = useState(jobId);
    const [loading, setLoading] = useState(() => Boolean(jobId));
    const [error, setError] = useState<string | null>(() => (jobId ? null : 'Invalid job id'));
    const [retryKey, setRetryKey] = useState(0);

    if (jobId !== prevJobId) {
        setPrevJobId(jobId);
        setJob(null);
        setLoading(Boolean(jobId));
        setError(jobId ? null : 'Invalid job id');
    }

    const retry = useCallback(() => {
        setRetryKey((key) => key + 1);
    }, []);

    useEffect(() => {
        if (!jobId) {
            return;
        }

        let mounted = true;

        const fetchJob = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getJobById(jobId);

                if (!mounted) {
                    return;
                }

                setJob(data);
            } catch (fetchError) {
                if (!mounted) {
                    return;
                }

                setJob(null);

                if (fetchError instanceof ApiError) {
                    setError(fetchError.message);
                } else {
                    setError('Unable to load role details. Please try again.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void fetchJob();

        return () => {
            mounted = false;
        };
    }, [jobId, retryKey]);

    return {
        job: jobId ? job : null,
        loading: jobId ? loading : false,
        error: jobId ? error : 'Invalid job id',
        retry,
    };
};
