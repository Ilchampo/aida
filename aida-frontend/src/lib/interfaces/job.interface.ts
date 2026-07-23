import type { PaginatedResponse } from '@lib/interfaces/common.interface';

export interface JobAccent {
    gradient: string;
    soft: string;
    text: string;
    border: string;
}

export const JOB_ACCENTS: JobAccent[] = [
    {
        gradient: 'from-indigo-500 via-violet-500 to-fuchsia-500',
        soft: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'hover:border-indigo-300',
    },
    {
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        soft: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'hover:border-emerald-300',
    },
    {
        gradient: 'from-orange-500 via-rose-500 to-pink-500',
        soft: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'hover:border-orange-300',
    },
];

export const JOB_ROLES = [
    'Intern Node Backend',
    'Intern Next.js Frontend',
    'Intern Javascript Full Stack',
    'Intern AI Researcher',
    'Trainee Product Manager',
    'Trainee Human Resources',
] as const;

export type JobRole = (typeof JOB_ROLES)[number];

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

export interface ListJobsQuery {
    title?: string;
    page?: number;
    limit?: number;
}

export type GetJobListingResponse = PaginatedResponse<JobListingItem>;
export type GetJobByIdResponse = JobData;
