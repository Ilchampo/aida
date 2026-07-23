import type { JobRole } from '@constants/schemas.constants';
import type { JobData, JobListingItem, JobPracticeSummary } from '@interfaces/job.interfaces';
import type { Job } from '@schemas/job.schema';
import type { Types } from 'mongoose';

import { JOBS_LISTING_DESCRIPTION_MAX_LENGTH } from '@constants/jobs.constants';
import { INTERVIEW_MAX_COMPLETED_TRIES_PER_ROLE } from '@constants/interviews.constants';

type JobLean = Pick<Job, 'title' | 'role' | 'tags' | 'description'> & {
    _id: Types.ObjectId;
};

const normalizeSearchText = (value: string): string => value.trim().toLowerCase();

const isSubsequenceMatch = (text: string, query: string): boolean => {
    if (query.length === 0) {
        return false;
    }

    let queryIndex = 0;

    for (const character of text) {
        if (character === query[queryIndex]) {
            queryIndex += 1;
        }

        if (queryIndex === query.length) {
            return true;
        }
    }

    return queryIndex === query.length;
};

export const scoreJobTitleMatch = (title: string, query: string): number => {
    const normalizedTitle = normalizeSearchText(title);
    const normalizedQuery = normalizeSearchText(query);

    if (normalizedQuery.length === 0) {
        return 0;
    }

    if (normalizedTitle === normalizedQuery) {
        return 100;
    }

    if (normalizedTitle.startsWith(normalizedQuery)) {
        return 90;
    }

    if (normalizedTitle.includes(normalizedQuery)) {
        return 75;
    }

    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    const matchedWords = queryWords.filter((word) => normalizedTitle.includes(word));

    if (matchedWords.length === queryWords.length && queryWords.length > 0) {
        return 65 + Math.min(queryWords.length * 2, 10);
    }

    if (matchedWords.length > 0) {
        return 45 + Math.round((matchedWords.length / queryWords.length) * 15);
    }

    if (isSubsequenceMatch(normalizedTitle, normalizedQuery)) {
        return 30 + Math.round((normalizedQuery.length / normalizedTitle.length) * 10);
    }

    return 0;
};

const truncateDescription = (description: string): string => {
    if (description.length <= JOBS_LISTING_DESCRIPTION_MAX_LENGTH) {
        return description;
    }

    return `${description.slice(0, JOBS_LISTING_DESCRIPTION_MAX_LENGTH)}`;
};

export const toJobListingItem = (job: JobLean): JobListingItem => ({
    _id: job._id.toString(),
    title: job.title,
    role: job.role as JobRole,
    tags: job.tags,
    description: truncateDescription(job.description),
});

export const buildJobPracticeSummary = (params: {
    completedAttempts: number;
    bestScore: number | null;
}): JobPracticeSummary => {
    const { completedAttempts, bestScore } = params;
    const remainingAttempts = Math.max(
        0,
        INTERVIEW_MAX_COMPLETED_TRIES_PER_ROLE - completedAttempts,
    );

    return {
        completedAttempts,
        remainingAttempts,
        bestScore,
        claimed: completedAttempts > 0,
    };
};

export const toJobData = (job: JobLean, practice: JobPracticeSummary): JobData => ({
    _id: job._id.toString(),
    title: job.title,
    role: job.role as JobRole,
    tags: job.tags,
    description: job.description,
    practice,
});
