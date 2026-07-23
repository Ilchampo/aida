import type {
    GlobalLeaderboardResponse,
    JobLeaderboardResponse,
} from '@lib/interfaces/leaderboard.interface';

import { apiCaller } from '@lib/utils/apiCaller';

export const getGlobalLeaderboard = (): Promise<GlobalLeaderboardResponse> =>
    apiCaller<GlobalLeaderboardResponse>({
        method: 'GET',
        url: '/leaderboard/global',
    });

export const getJobLeaderboard = (jobId: string): Promise<JobLeaderboardResponse> =>
    apiCaller<JobLeaderboardResponse>({
        method: 'GET',
        url: `/leaderboard/jobs/${jobId}`,
    });
