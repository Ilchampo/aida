import { useJobDetail } from '@hooks/useJobDetail';
import type { JobData } from '@lib/interfaces/job.interface';
import { isJobData } from '@lib/utils/job.util';

interface UseRoomJobResult {
    job: JobData | null;
    loading: boolean;
    error: string | null;
    remainingAttempts: number;
    retry: VoidFunction;
}

export const useRoomJob = (jobId: string | undefined): UseRoomJobResult => {
    const { job, loading, error, retry } = useJobDetail(jobId);

    const practiceJob = job && isJobData(job) ? job : null;

    const resolvedError =
        error ?? (!loading && jobId && !practiceJob ? 'Role not available for interview' : null);

    return {
        job: practiceJob,
        loading,
        error: resolvedError,
        remainingAttempts: practiceJob?.practice.remainingAttempts ?? 0,
        retry,
    };
};
