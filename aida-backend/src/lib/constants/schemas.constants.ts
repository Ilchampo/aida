export const JOB_ROLES = [
    'Intern Node Backend',
    'Intern Next.js Frontend',
    'Intern Javascript Full Stack',
    'Intern AI Researcher',
    'Trainee Product Manager',
    'Trainee Human Resources',
] as const;
export type JobRole = (typeof JOB_ROLES)[number];

export const INTERVIEW_STATUSES = ['in_progress', 'completed', 'abandoned'] as const;
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const QUESTION_CATEGORIES = ['behavioral', 'technical'] as const;
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export const DECISION_SOURCES = ['bank', 'generated'] as const;
export type DecisionSource = (typeof DECISION_SOURCES)[number];

export const TRANSCRIPT_SPEAKERS = ['ai', 'candidate'] as const;
export type TranscriptSpeaker = (typeof TRANSCRIPT_SPEAKERS)[number];

export const RUBRIC_WEIGHT_MIN = 1 as const;
export const RUBRIC_WEIGHT_MAX = 3 as const;
