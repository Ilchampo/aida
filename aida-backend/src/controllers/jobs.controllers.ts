import type { ListJobsParams } from '@interfaces/job.interfaces';

import { controller } from '@utils/controller.utils';
import { UnauthorizedError } from '@utils/errors.utils';
import { jobIdParamsSchema, listJobsQuerySchema } from '@zod/jobs.zod';

import * as jobService from '@services/job.services';

export const listJobs = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { page, limit, title } = listJobsQuerySchema.parse(req.query);

    const params: ListJobsParams = {
        page,
        limit,
    };

    if (title) {
        params.title = title;
    }

    const data = await jobService.listJobs(params);

    return { statusCode: 200, data };
});

export const getJobById = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { id } = jobIdParamsSchema.parse(req.params);

    const data = await jobService.getJobById({
        id,
        candidateId: req.auth.sub,
    });

    return { statusCode: 200, data };
});
