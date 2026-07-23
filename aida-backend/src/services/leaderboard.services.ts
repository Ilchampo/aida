import type {
    GlobalLeaderboardResponse,
    JobLeaderboardResponse,
} from '@interfaces/leaderboard.interfaces';

import { LEADERBOARD_TOP_LIMIT } from '@constants/interviews.constants';
import { NotFoundError } from '@utils/errors.utils';
import { interviewModel } from '@schemas/interview.schema';
import { jobModel } from '@schemas/job.schema';
import { Types } from 'mongoose';

export const getGlobalLeaderboard = async (): Promise<GlobalLeaderboardResponse> => {
    const rows = await interviewModel.aggregate<{
        _id: Types.ObjectId;
        averageBestScore: number;
        rolesCounted: number;
        earliestBestEndedAt: Date | null;
        givenName: string;
        pictureUrl: string | null;
    }>([
        {
            $match: {
                status: 'completed',
                'evaluation.overall_score': { $type: 'number' },
            },
        },
        {
            $group: {
                _id: {
                    candidateId: '$candidate_id',
                    jobId: '$job_id',
                },
                bestScore: { $max: '$evaluation.overall_score' },
                earliestBestEndedAt: { $min: '$ended_at' },
            },
        },
        {
            $group: {
                _id: '$_id.candidateId',
                averageBestScore: { $avg: '$bestScore' },
                rolesCounted: { $sum: 1 },
                earliestBestEndedAt: { $min: '$earliestBestEndedAt' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                averageBestScore: { $round: ['$averageBestScore', 1] },
                rolesCounted: 1,
                earliestBestEndedAt: 1,
                givenName: '$user.given_name',
                pictureUrl: '$user.picture_url',
            },
        },
        {
            $sort: {
                averageBestScore: -1,
                earliestBestEndedAt: 1,
            },
        },
        { $limit: LEADERBOARD_TOP_LIMIT },
    ]);

    return {
        items: rows.map((row, index) => ({
            rank: index + 1,
            userId: row._id.toString(),
            givenName: row.givenName,
            pictureUrl: row.pictureUrl ?? null,
            averageBestScore: row.averageBestScore,
            rolesCounted: row.rolesCounted,
        })),
    };
};

export const getJobLeaderboard = async (jobId: string): Promise<JobLeaderboardResponse> => {
    const job = await jobModel.findById(jobId).select('_id').lean();

    if (!job) {
        throw new NotFoundError('Job not found');
    }

    const rows = await interviewModel.aggregate<{
        _id: Types.ObjectId;
        bestScore: number;
        earliestBestEndedAt: Date | null;
        givenName: string;
        pictureUrl: string | null;
    }>([
        {
            $match: {
                job_id: new Types.ObjectId(jobId),
                status: 'completed',
                'evaluation.overall_score': { $type: 'number' },
            },
        },
        {
            $group: {
                _id: '$candidate_id',
                bestScore: { $max: '$evaluation.overall_score' },
                earliestBestEndedAt: { $min: '$ended_at' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                bestScore: 1,
                earliestBestEndedAt: 1,
                givenName: '$user.given_name',
                pictureUrl: '$user.picture_url',
            },
        },
        {
            $sort: {
                bestScore: -1,
                earliestBestEndedAt: 1,
            },
        },
        { $limit: LEADERBOARD_TOP_LIMIT },
    ]);

    return {
        jobId,
        items: rows.map((row, index) => ({
            rank: index + 1,
            userId: row._id.toString(),
            givenName: row.givenName,
            pictureUrl: row.pictureUrl ?? null,
            bestScore: row.bestScore,
        })),
    };
};
