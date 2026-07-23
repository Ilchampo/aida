import type {
    DecisionSource,
    InterviewStatus,
    JobRole,
    TranscriptSpeaker,
} from '@constants/schemas.constants';

export interface TranscriptTurn {
    idx: number;
    speaker: TranscriptSpeaker;
    text: string;
    started_at: string;
    ended_at: string;
    question_id: string | null;
    is_follow_up: boolean;
}

export interface DecisionLogEntry {
    turn_idx: number;
    source: DecisionSource;
    question_id: string | null;
    reason: string;
    skills_detected: string[];
    topics_covered: string[];
    gaps: string[];
}

export interface PerSkillEvaluation {
    skill: string;
    score: number;
    evidence: string;
}

export interface InterviewEvaluation {
    overall_score: number;
    per_skill: PerSkillEvaluation[];
    strengths: string[];
    concerns: string[];
    summary: string;
}

export interface Interview {
    _id: string;
    job_id: string;
    candidate_id: string;
    status: InterviewStatus;
    started_at: string;
    ended_at: string | null;
    transcript: TranscriptTurn[];
    decision_log: DecisionLogEntry[];
    evaluation: InterviewEvaluation | null;
}

export type InterviewPhase = 'active' | 'terminal';

export interface CreateInterviewBody {
    jobId: string;
}

export interface CreateInterviewParams {
    jobId: string;
    candidateId: string;
}

export interface CreateInterviewResponse {
    interviewId: string;
    status: 'in_progress';
}

export interface SubmitTurnBody {
    startedAt: string;
    endedAt: string;
    clientTurnId: string;
    format?: string;
}

export interface SubmitTurnParams {
    interviewId: string;
    candidateId: string;
    audio: Buffer;
    audioMimeType: string;
    startedAt: string;
    endedAt: string;
    clientTurnId: string;
    format?: string;
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

export interface IdempotentTurnRecord {
    clientTurnId: string;
    text: string;
    aiText: string;
    aiAudio: string | null;
    aiAudioContentType: string | null;
    aiSpeechFailed: boolean;
    isFinal: boolean;
    questionCount: number;
}

export interface CompleteInterviewParams {
    interviewId: string;
    candidateId: string;
}

export interface CompleteInterviewResponse {
    status: 'completed';
}

export interface AbandonInterviewParams {
    interviewId: string;
    candidateId: string;
}

export interface AbandonInterviewResponse {
    status: 'abandoned';
}

export interface InterviewJobSummary {
    _id: string;
    title: string;
    role: JobRole;
}

export interface InterviewUserSummary {
    _id: string;
    givenName: string;
    pictureUrl: string | null;
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

export interface ListMyInterviewsParams {
    candidateId: string;
    page: number;
    limit: number;
    jobId?: string;
}

export interface PaginatedOwnerInterviewListResponse {
    items: OwnerInterviewListItem[];
    page: number;
    totalPages: number;
    totalItems: number;
}

export type GetInterviewDetailResponse = OwnerInterviewDetail;
