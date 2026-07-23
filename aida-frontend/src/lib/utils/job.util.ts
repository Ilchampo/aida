import type { GetJobByIdResponse, JobData } from '@lib/interfaces/job.interface';

export const isJobData = (job: GetJobByIdResponse): job is JobData => 'practice' in job;
