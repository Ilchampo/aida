import { controller } from '@utils/controller.utils';
import { UnauthorizedError } from '@utils/errors.utils';
import { jobLeaderboardParamsSchema } from '@zod/leaderboard.zod';

import * as leaderboardService from '@services/leaderboard.services';

export const getGlobalLeaderboard = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const data = await leaderboardService.getGlobalLeaderboard();

    return { statusCode: 200, data };
});

export const getJobLeaderboard = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { jobId } = jobLeaderboardParamsSchema.parse(req.params);
    const data = await leaderboardService.getJobLeaderboard(jobId);

    return { statusCode: 200, data };
});
