import type {
    GetJobByIdResponse,
    GetJobListingResponse,
    ListJobsQuery,
} from '@lib/interfaces/job.interface';

import { apiCaller } from '@lib/utils/apiCaller';

export const listJobs = (query: ListJobsQuery = {}): Promise<GetJobListingResponse> =>
    apiCaller<GetJobListingResponse>({
        method: 'GET',
        url: '/jobs',
        params: query,
    });

export const getJobById = (id: string): Promise<GetJobByIdResponse> =>
    apiCaller<GetJobByIdResponse>({
        method: 'GET',
        url: `/jobs/${id}`,
    });
