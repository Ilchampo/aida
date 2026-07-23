import type { InterviewEvaluation } from '@interfaces/interview.interfaces';
import type { InterviewerJobContext } from '@interfaces/interviewer.interfaces';
import type { Interview } from '@schemas/interview.schema';
import type { Types } from 'mongoose';

export type EvaluationInterviewContext = Pick<Interview, 'transcript' | 'decision_log'> & {
    _id: Types.ObjectId;
};

export interface RunInterviewEvaluationInput {
    job: InterviewerJobContext;
    interview: EvaluationInterviewContext;
}

export type InterviewEvaluationResult = InterviewEvaluation;
