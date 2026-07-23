import { useCallback, useEffect, useState } from 'react';

import { getInterviewById } from '@api/interview.api';
import type { InterviewDetail } from '@lib/interfaces/interview.interface';
import { ApiError } from '@lib/utils/apiCaller';

interface UseInterviewDetailResult {
    interview: InterviewDetail | null;
    loading: boolean;
    error: string | null;
    retry: VoidFunction;
}

export const useInterviewDetail = (interviewId: string | undefined): UseInterviewDetailResult => {
    const [interview, setInterview] = useState<InterviewDetail | null>(null);
    const [prevInterviewId, setPrevInterviewId] = useState(interviewId);
    const [loading, setLoading] = useState(() => Boolean(interviewId));
    const [error, setError] = useState<string | null>(() =>
        interviewId ? null : 'Invalid interview id',
    );
    const [retryKey, setRetryKey] = useState(0);

    if (interviewId !== prevInterviewId) {
        setPrevInterviewId(interviewId);
        setInterview(null);
        setLoading(Boolean(interviewId));
        setError(interviewId ? null : 'Invalid interview id');
    }

    const retry = useCallback(() => {
        setRetryKey((key) => key + 1);
    }, []);

    useEffect(() => {
        if (!interviewId) {
            return;
        }

        let mounted = true;

        const fetchInterview = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getInterviewById(interviewId);

                if (!mounted) {
                    return;
                }

                if (data.status !== 'completed') {
                    setInterview(null);
                    setError('Interview is not yet completed.');
                    return;
                }

                setInterview(data);
            } catch (fetchError) {
                if (!mounted) {
                    return;
                }

                setInterview(null);

                if (fetchError instanceof ApiError) {
                    setError(fetchError.message);
                } else {
                    setError('Unable to load interview record. Please try again.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void fetchInterview();

        return () => {
            mounted = false;
        };
    }, [interviewId, retryKey]);

    return {
        interview: interviewId ? interview : null,
        loading: interviewId ? loading : false,
        error: interviewId ? error : 'Invalid interview id',
        retry,
    };
};
