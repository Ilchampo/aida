import type { JobRole } from '@constants/schemas.constants';

export interface JobListingItem {
    _id: string;
    title: string;
    role: JobRole;
    tags: string[];
    description: string;
}

export interface JobPracticeSummary {
    completedAttempts: number;
    remainingAttempts: number;
    bestScore: number | null;
    claimed: boolean;
}

export interface JobData {
    _id: string;
    title: string;
    role: JobRole;
    tags: string[];
    description: string;
    practice: JobPracticeSummary;
}

export interface ListJobsParams {
    page: number;
    limit: number;
    title?: string;
}

export interface GetJobByIdParams {
    id: string;
    candidateId: string;
}

export interface PaginatedJobListingResponse {
    items: JobListingItem[];
    page: number;
    totalPages: number;
    totalItems: number;
}

export type GetJobListingResponse = PaginatedJobListingResponse;
export type GetJobByIdResponse = JobData;
