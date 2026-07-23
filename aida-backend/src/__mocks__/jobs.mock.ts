/**
 * Job endpoint mocks for frontend development.
 * Shapes match GET /api/jobs and GET /api/jobs/:id responses.
 */

export type JobRole =
    | 'Intern Node Backend'
    | 'Intern Next.js Frontend'
    | 'Intern Javascript Full Stack'
    | 'Intern AI Researcher'
    | 'Trainee Product Manager'
    | 'Trainee Human Resources';

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

export type GetJobListingResponse = {
    items: JobListingItem[];
    page: number;
    totalPages: number;
    totalItems: number;
};

export type GetJobByIdResponse = JobData;

/** GET /api/jobs */
export const getJobListingMock: GetJobListingResponse = {
    items: [
        {
            _id: '6a46f194945b1415e56dbf8b',
            title: 'Intern Node.js Backend Developer',
            role: 'Intern Node Backend',
            tags: ['node.js', 'typescript', 'express', 'rest-api', 'postgresql'],
            description:
                'LedgerBridge is a B2B invoicing platform helping small businesses reconcile payments.',
        },
        {
            _id: '6a46f194945b1415e56dbf8c',
            title: 'Intern Next.js Frontend Developer',
            role: 'Intern Next.js Frontend',
            tags: ['next.js', 'react', 'typescript', 'frontend'],
            description: 'Practice frontend interview focused on Next.js and React fundamentals.',
        },
    ],
    page: 1,
    totalPages: 1,
    totalItems: 2,
};

/** GET /api/jobs/:id */
export const getJobByIdMock: GetJobByIdResponse = {
    _id: '6a46f194945b1415e56dbf8b',
    title: 'Intern Node.js Backend Developer',
    role: 'Intern Node Backend',
    tags: ['node.js', 'typescript', 'express', 'rest-api', 'postgresql'],
    description:
        'LedgerBridge is a B2B invoicing platform helping small businesses reconcile payments with tax authorities.',
    practice: {
        completedAttempts: 1,
        remainingAttempts: 2,
        bestScore: 78,
        claimed: true,
    },
};
