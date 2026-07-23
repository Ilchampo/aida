import type { EvaluationResultPayload } from '@zod/evaluation.zod';
import type {
    InterviewEvaluationResult,
    RunInterviewEvaluationInput,
} from '@interfaces/evaluation.interfaces';
import type { InterviewerInterviewContext } from '@interfaces/interviewer.interfaces';
import type { Interview } from '@schemas/interview.schema';

import { buildCoverageState } from '@utils/interviewer.utils';

export const formatTranscriptForEvaluation = (transcript: Interview['transcript']): string =>
    transcript.map((turn) => `[${turn.speaker}] ${turn.text}`).join('\n');

export const isReadyForCompletion = (interview: Pick<Interview, 'idempotent_turns'>): boolean =>
    interview.idempotent_turns.some((turn) => turn.is_final);

export const toInterviewEvaluation = (
    payload: EvaluationResultPayload,
): InterviewEvaluationResult => ({
    overall_score: payload.overall_score,
    per_skill: payload.per_skill.map((item) => ({
        skill: item.skill,
        score: item.score,
        evidence: item.evidence,
    })),
    strengths: payload.strengths,
    concerns: payload.concerns,
    summary: payload.summary,
});

export const buildDeterministicEvaluation = (
    job: RunInterviewEvaluationInput['job'],
    interview: InterviewerInterviewContext,
): InterviewEvaluationResult => {
    const coverage = buildCoverageState(job, interview);
    const candidateText = interview.transcript
        .filter((turn) => turn.speaker === 'candidate')
        .map((turn) => turn.text)
        .join(' ');

    const perSkill = job.rubric.map((item) => {
        const covered = coverage.topicsCovered.includes(item.skill);
        const signalHit = item.signals.some((signal) =>
            candidateText.toLowerCase().includes(signal.toLowerCase()),
        );
        const score = covered ? (signalHit ? 78 : 72) : signalHit ? 68 : 58;

        return {
            skill: item.skill,
            score,
            evidence: covered
                ? `Rubric skill was covered during the interview.${signalHit ? ' Candidate mentioned related signals.' : ''}`
                : `Limited evidence for ${item.skill} in the transcript.`,
        };
    });

    const overallScore = Math.round(
        perSkill.reduce((sum, item) => sum + item.score, 0) / perSkill.length,
    );

    const strengths = perSkill
        .filter((item) => item.score >= 75)
        .slice(0, 3)
        .map((item) => `Solid ${item.skill.toLowerCase()} demonstrated in answers.`);

    const concerns =
        coverage.gaps.length > 0
            ? coverage.gaps.map((skill) => `Needs stronger evidence for ${skill}.`)
            : ['Some answers could include more concrete examples.'];

    return {
        overall_score: overallScore,
        per_skill: perSkill,
        strengths: strengths.length > 0 ? strengths : ['Completed the full interview flow.'],
        concerns,
        summary: `Deterministic rubric evaluation for ${job.title}. Overall score ${overallScore}/100 based on transcript coverage and rubric signals.`,
    };
};

export const normalizeEvaluationForRubric = (
    evaluation: InterviewEvaluationResult,
    job: RunInterviewEvaluationInput['job'],
): InterviewEvaluationResult => {
    const rubricSkills = job.rubric.map((item) => item.skill);
    const bySkill = new Map(evaluation.per_skill.map((item) => [item.skill, item]));

    const perSkill = rubricSkills.map((skill) => {
        const existing = bySkill.get(skill);

        if (existing) {
            return existing;
        }

        return {
            skill,
            score: evaluation.overall_score,
            evidence: 'Insufficient evidence in structured evaluation output.',
        };
    });

    return {
        ...evaluation,
        per_skill: perSkill,
    };
};
