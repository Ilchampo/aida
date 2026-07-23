import type {
    ApiErrorResponse,
    ApiSuccessResponse,
    ValidationErrorResponse,
} from '@lib/interfaces/common.interface';
import type { AxiosRequestConfig } from 'axios';

import { config } from '@lib/config';
import axios, { isAxiosError } from 'axios';

export class ApiError extends Error {
    readonly statusCode: number;
    readonly errors?: ValidationErrorResponse['errors'];
    readonly details?: Record<string, unknown>;

    constructor(
        message: string,
        statusCode: number,
        errors?: ValidationErrorResponse['errors'],
        details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;

        if (errors !== undefined) {
            this.errors = errors;
        }

        if (details !== undefined) {
            this.details = details;
        }
    }
}

const axiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiCaller = async <T>(requestConfig: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await axiosInstance.request<ApiSuccessResponse<T>>(requestConfig);

        return response.data.data;
    } catch (error) {
        if (!isAxiosError(error)) {
            throw error;
        }

        const responseData = error.response?.data as
            ApiErrorResponse | ValidationErrorResponse | undefined;

        const statusCode = error.response?.status ?? 500;

        if (responseData && 'errors' in responseData) {
            throw new ApiError(responseData.message, statusCode, responseData.errors);
        }

        if (responseData && 'message' in responseData) {
            throw new ApiError(
                responseData.message,
                statusCode,
                undefined,
                'details' in responseData ? responseData.details : undefined,
            );
        }

        throw new ApiError(error.message, statusCode);
    }
};
