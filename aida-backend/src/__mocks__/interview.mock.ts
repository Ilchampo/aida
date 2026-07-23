/**
 * Interview endpoint mocks for frontend development.
 * Shapes match owner progression / detail APIs.
 */

export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';

export interface InterviewJobSummary {
    _id: string;
    title: string;
    role: string;
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
    speaker: 'ai' | 'candidate';
    text: string;
    startedAt: string;
    endedAt: string;
    questionId: string | null;
    isFollowUp: boolean;
}

export interface InterviewDecisionLogEntry {
    turnIdx: number;
    source: 'bank' | 'generated';
    questionId: string | null;
    reason: string;
    skillsDetected: string[];
    topicsCovered: string[];
    gaps: string[];
}

export interface InterviewEvaluationDetail {
    overallScore: number;
    perSkill: Array<{ skill: string; score: number; evidence: string }>;
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

/** GET /api/interviews/me */
export const listMyInterviewsMock = {
    items: [
        {
            _id: '7b57f194945b1415e56dbf01',
            job: {
                _id: '6a46f194945b1415e56dbf8b',
                title: 'Intern Node.js Backend Developer',
                role: 'Intern Node Backend',
            },
            status: 'completed' as const,
            startedAt: '2026-07-01T15:00:00.000Z',
            endedAt: '2026-07-01T15:28:00.000Z',
            overallScore: 78,
            questionsAsked: 8,
            duration: 1680,
        },
        {
            _id: '7b57f194945b1415e56dbf02',
            job: {
                _id: '6a46f194945b1415e56dbf8b',
                title: 'Intern Node.js Backend Developer',
                role: 'Intern Node Backend',
            },
            status: 'completed' as const,
            startedAt: '2026-07-10T15:00:00.000Z',
            endedAt: '2026-07-10T15:32:00.000Z',
            overallScore: 85,
            questionsAsked: 9,
            duration: 1920,
        },
    ] satisfies OwnerInterviewListItem[],
    page: 1,
    totalPages: 1,
    totalItems: 2,
};

/** GET /api/interviews/:interviewId (completed) */
export const getInterviewDetailMock: OwnerInterviewDetail = {
    _id: '7b57f194945b1415e56dbf02',
    job: {
        _id: '6a46f194945b1415e56dbf8b',
        title: 'Intern Node.js Backend Developer',
        role: 'Intern Node Backend',
    },
    status: 'completed',
    startedAt: '2026-07-10T15:00:00.000Z',
    endedAt: '2026-07-10T15:32:00.000Z',
    questionsAsked: 9,
    transcript: [
        {
            idx: 0,
            speaker: 'ai',
            text: "Welcome! Let's start with your experience building Node.js APIs.",
            startedAt: '2026-07-10T15:00:05.000Z',
            endedAt: '2026-07-10T15:00:05.000Z',
            questionId: null,
            isFollowUp: false,
        },
        {
            idx: 1,
            speaker: 'candidate',
            text: 'I built a REST API with Express and PostgreSQL for a coursework project.',
            startedAt: '2026-07-10T15:01:00.000Z',
            endedAt: '2026-07-10T15:01:45.000Z',
            questionId: null,
            isFollowUp: false,
        },
    ],
    decisionLog: [
        {
            turnIdx: 0,
            source: 'bank',
            questionId: '8c68f194945b1415e56dbf11',
            reason: 'Opening behavioral question from the bank.',
            skillsDetected: [],
            topicsCovered: ['communication'],
            gaps: ['Node.js runtime & async patterns'],
        },
    ],
    evaluation: {
        overallScore: 85,
        perSkill: [
            {
                skill: 'Node.js runtime & async patterns',
                score: 82,
                evidence: 'Explained event loop and non-blocking I/O clearly.',
            },
        ],
        strengths: ['Clear structure', 'Concrete project examples'],
        concerns: ['Limited production ops depth'],
        summary: 'Solid internship-level backend interview with clear communication.',
    },
};

/** GET /api/leaderboard/global */
export const globalLeaderboardMock = {
    items: [
        {
            rank: 1,
            userId: '5a35f194945b1415e56dbe01',
            givenName: 'Alex',
            pictureUrl: 'https://lh3.googleusercontent.com/a/example',
            averageBestScore: 88.5,
            rolesCounted: 2,
        },
    ],
};
