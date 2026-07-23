import type { ListMyInterviewsParams } from '@interfaces/interview.interfaces';

import { controller } from '@utils/controller.utils';
import { UnauthorizedError, UnprocessableEntityError } from '@utils/errors.utils';
import {
    createInterviewBodySchema,
    interviewIdParamsSchema,
    listMyInterviewsQuerySchema,
} from '@zod/interviews.zod';
import { submitTurnMetadataSchema } from '@zod/speech.zod';

import * as interviewService from '@services/interview.services';

export const createInterview = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { jobId } = createInterviewBodySchema.parse(req.body);

    const data = await interviewService.createInterview({
        jobId,
        candidateId: req.auth.sub,
    });

    return { statusCode: 201, data };
});

export const abandonInterview = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { interviewId } = interviewIdParamsSchema.parse(req.params);

    const data = await interviewService.abandonInterview({
        interviewId,
        candidateId: req.auth.sub,
    });

    return { statusCode: 200, data };
});

export const submitTurn = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { interviewId } = interviewIdParamsSchema.parse(req.params);
    const { startedAt, endedAt, clientTurnId, format } = submitTurnMetadataSchema.parse(req.body);

    if (!req.file?.buffer || req.file.size === 0) {
        throw new UnprocessableEntityError('Audio recording is required.');
    }

    const data = await interviewService.submitTurn({
        interviewId,
        candidateId: req.auth.sub,
        audio: req.file.buffer,
        audioMimeType: req.file.mimetype,
        startedAt,
        endedAt,
        clientTurnId,
        ...(format !== undefined ? { format } : {}),
    });

    return { statusCode: 200, data };
});

export const completeInterview = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { interviewId } = interviewIdParamsSchema.parse(req.params);

    const data = await interviewService.completeInterview({
        interviewId,
        candidateId: req.auth.sub,
    });

    return { statusCode: 200, data };
});

export const getActiveInterview = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const data = await interviewService.getActiveInterview(req.auth.sub);

    return { statusCode: 200, data };
});

export const listMyInterviews = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { jobId, page, limit } = listMyInterviewsQuerySchema.parse(req.query);

    const params: ListMyInterviewsParams = {
        candidateId: req.auth.sub,
        page,
        limit,
    };

    if (jobId !== undefined) {
        params.jobId = jobId;
    }

    const data = await interviewService.listMyInterviews(params);

    return { statusCode: 200, data };
});

export const getInterviewById = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const { interviewId } = interviewIdParamsSchema.parse(req.params);

    const data = await interviewService.getInterviewByIdForOwner(interviewId, req.auth.sub);

    return { statusCode: 200, data };
});
