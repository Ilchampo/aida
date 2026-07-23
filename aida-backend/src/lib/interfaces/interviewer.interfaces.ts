import type { DecisionSource } from '@constants/schemas.constants';
import type { Job } from '@schemas/job.schema';
import type { Interview } from '@schemas/interview.schema';
import type { Types } from 'mongoose';

import type { InterviewerAction } from '@constants/interviewer.constants';

export type InterviewerJobContext = Pick<Job, 'title' | 'role' | 'rubric' | 'question_bank'> & {
    _id: Types.ObjectId;
};

export type InterviewerInterviewContext = Pick<Interview, 'transcript' | 'decision_log'> & {
    _id: Types.ObjectId;
};

export interface InterviewerCoverageState {
    rubricSkills: string[];
    topicsCovered: string[];
    skillsDetected: string[];
    gaps: string[];
}

export interface InterviewerBudgetState {
    questionsAsked: number;
    followUpsAsked: number;
}

export interface InterviewerDecisionLogInput {
    turnIdx: number;
    source: DecisionSource;
    questionId: string | null;
    reason: string;
    skillsDetected: string[];
    topicsCovered: string[];
    gaps: string[];
}

export interface InterviewerEngineResult {
    isFinal: boolean;
    questionText: string;
    questionId: string | null;
    isFollowUp: boolean;
    source: DecisionSource;
    decisionLogEntry: InterviewerDecisionLogInput;
}

export interface LlmInterviewerDecision {
    action: InterviewerAction;
    questionId: string | null;
    questionText: string;
    reason: string;
    skillsDetected: string[];
    topicsCovered: string[];
    gaps: string[];
}

export interface DecideNextQuestionInput {
    job: InterviewerJobContext;
    interview: InterviewerInterviewContext;
}
