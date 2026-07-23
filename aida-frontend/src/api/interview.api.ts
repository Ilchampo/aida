import type {
    AbandonInterviewResponse,
    CompleteInterviewResponse,
    CreateInterviewBody,
    CreateInterviewResponse,
    GetActiveInterviewResponse,
    GetInterviewDetailResponse,
    GetMyInterviewsResponse,
    ListMyInterviewsQuery,
    SubmitTurnBody,
    SubmitTurnResponse,
} from '@lib/interfaces/interview.interface';

import { apiCaller } from '@lib/utils/apiCaller';

export const getActiveInterview = (): Promise<GetActiveInterviewResponse> =>
    apiCaller<GetActiveInterviewResponse>({
        method: 'GET',
        url: '/interviews/me/active',
    });

export const listMyInterviews = (
    query: ListMyInterviewsQuery = {},
): Promise<GetMyInterviewsResponse> =>
    apiCaller<GetMyInterviewsResponse>({
        method: 'GET',
        url: '/interviews/me',
        params: query,
    });

export const getInterviewById = (interviewId: string): Promise<GetInterviewDetailResponse> =>
    apiCaller<GetInterviewDetailResponse>({
        method: 'GET',
        url: `/interviews/${interviewId}`,
    });

export const createInterview = (body: CreateInterviewBody): Promise<CreateInterviewResponse> =>
    apiCaller<CreateInterviewResponse>({
        method: 'POST',
        url: '/interviews',
        data: body,
    });

export const submitTurn = (
    interviewId: string,
    body: SubmitTurnBody,
): Promise<SubmitTurnResponse> => {
    const formData = new FormData();

    formData.append('audio', body.audio, 'answer.webm');
    formData.append('startedAt', body.startedAt);
    formData.append('endedAt', body.endedAt);
    formData.append('clientTurnId', body.clientTurnId);

    return apiCaller<SubmitTurnResponse>({
        method: 'POST',
        url: `/interviews/${interviewId}/turns`,
        data: formData,
        transformRequest: [
            (data, headers) => {
                if (data instanceof FormData) {
                    delete headers['Content-Type'];
                }

                return data;
            },
        ],
    });
};

export const abandonInterview = (interviewId: string): Promise<AbandonInterviewResponse> =>
    apiCaller<AbandonInterviewResponse>({
        method: 'POST',
        url: `/interviews/${interviewId}/abandon`,
    });

export const completeInterview = (interviewId: string): Promise<CompleteInterviewResponse> =>
    apiCaller<CompleteInterviewResponse>({
        method: 'POST',
        url: `/interviews/${interviewId}/complete`,
    });
