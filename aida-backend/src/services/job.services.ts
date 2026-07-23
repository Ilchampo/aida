import type {
    GetJobByIdParams,
    GetJobByIdResponse,
    ListJobsParams,
    PaginatedJobListingResponse,
} from '@interfaces/job.interfaces';

import { JOBS_TITLE_MIN_SCORE } from '@constants/jobs.constants';
import { NotFoundError } from '@utils/errors.utils';
import {
    buildJobPracticeSummary,
    scoreJobTitleMatch,
    toJobData,
    toJobListingItem,
} from '@utils/job.utils';
import { interviewModel } from '@schemas/interview.schema';
import { jobModel } from '@schemas/job.schema';
import { Types } from 'mongoose';

export const listJobs = async (params: ListJobsParams): Promise<PaginatedJobListingResponse> => {
    const { page, limit, title } = params;

    const jobs = await jobModel.find({}).select('_id title role tags description').lean();

    const sortedJobs = title
        ? jobs
              .map((job) => ({
                  job,
                  score: scoreJobTitleMatch(job.title, title),
              }))
              .filter(({ score }) => score >= JOBS_TITLE_MIN_SCORE)
              .sort((left, right) => {
                  if (right.score !== left.score) {
                      return right.score - left.score;
                  }

                  return left.job.title.localeCompare(right.job.title);
              })
              .map(({ job }) => job)
        : [...jobs].sort((left, right) => left.title.localeCompare(right.title));

    const totalItems = sortedJobs.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;
    const items = sortedJobs.slice(skip, skip + limit).map(toJobListingItem);

    return {
        items,
        page: currentPage,
        totalPages,
        totalItems,
    };
};

export const getJobById = async (params: GetJobByIdParams): Promise<GetJobByIdResponse> => {
    const { id, candidateId } = params;

    const job = await jobModel.findById(id).lean();

    if (!job) {
        throw new NotFoundError('Job not found');
    }

    const completed = await interviewModel
        .find({
            job_id: new Types.ObjectId(id),
            candidate_id: new Types.ObjectId(candidateId),
            status: 'completed',
        })
        .select('evaluation.overall_score')
        .lean();

    const scores = completed
        .map((interview) => interview.evaluation?.overall_score)
        .filter((score): score is number => typeof score === 'number');

    const bestScore = scores.length > 0 ? Math.max(...scores) : null;

    return toJobData(
        job,
        buildJobPracticeSummary({
            completedAttempts: completed.length,
            bestScore,
        }),
    );
};
