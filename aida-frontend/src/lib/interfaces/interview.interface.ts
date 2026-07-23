import type { PaginatedResponse } from '@lib/interfaces/common.interface';
import type { JobRole } from '@lib/interfaces/job.interface';

export const INTERVIEW_STATUSES = ['in_progress', 'completed', 'abandoned'] as const;

export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const DECISION_SOURCES = ['bank', 'generated'] as const;

export type DecisionSource = (typeof DECISION_SOURCES)[number];

export const TRANSCRIPT_SPEAKERS = ['ai', 'candidate'] as const;

export type TranscriptSpeaker = (typeof TRANSCRIPT_SPEAKERS)[number];

export interface InterviewJobSummary {
    _id: string;
    title: string;
    role: JobRole;
}

export interface OwnerInterviewListItem {
    _id: string;
    job: InterviewJobSummary;
    status: 'completed';
    startedAt: string;
    endedAt: string | null;
    overallScore: number | null;
    questionsAsked: number;
    duration: number | null;
}

export interface InterviewTranscriptTurn {
    idx: number;
    speaker: TranscriptSpeaker;
    text: string;
    startedAt: string;
    endedAt: string;
    questionId: string | null;
    isFollowUp: boolean;
}

export interface InterviewDecisionLogEntry {
    turnIdx: number;
    source: DecisionSource;
    questionId: string | null;
    reason: string;
    skillsDetected: string[];
    topicsCovered: string[];
    gaps: string[];
}

export interface InterviewPerSkillEvaluation {
    skill: string;
    score: number;
    evidence: string;
}

export interface InterviewEvaluationDetail {
    overallScore: number;
    perSkill: InterviewPerSkillEvaluation[];
    strengths: string[];
    concerns: string[];
    summary: string;
}

export interface OwnerInterviewDetail {
    _id: string;
    job: InterviewJobSummary;
    status: InterviewStatus;
    startedAt: string;
    endedAt: string | null;
    transcript: InterviewTranscriptTurn[];
    decisionLog: InterviewDecisionLogEntry[];
    evaluation: InterviewEvaluationDetail | null;
    questionsAsked: number;
}

export interface ListMyInterviewsQuery {
    jobId?: string;
    page?: number;
    limit?: number;
}

export type GetMyInterviewsResponse = PaginatedResponse<OwnerInterviewListItem>;
export type GetInterviewDetailResponse = OwnerInterviewDetail;
export type GetActiveInterviewResponse = OwnerInterviewDetail | null;

export interface CreateInterviewBody {
    jobId: string;
}

export interface CreateInterviewResponse {
    interviewId: string;
    status: 'in_progress';
}

export interface SubmitTurnBody {
    audio: Blob;
    startedAt: string;
    endedAt: string;
    clientTurnId: string;
}

export interface SubmitTurnResponse {
    text: string;
    aiText: string;
    aiAudio: string | null;
    aiAudioContentType: string | null;
    aiSpeechFailed: boolean;
    isFinal: boolean;
    questionCount: number;
}

export interface CompleteInterviewResponse {
    status: 'completed';
}

export interface AbandonInterviewResponse {
    status: 'abandoned';
}

/** @deprecated Use OwnerInterviewDetail */
export type InterviewDetail = OwnerInterviewDetail;
