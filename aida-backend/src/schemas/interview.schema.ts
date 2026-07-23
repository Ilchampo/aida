import type { HydratedDocument, InferSchemaType, Model, Types } from 'mongoose';

import { Schema, model } from 'mongoose';
import {
    DECISION_SOURCES,
    INTERVIEW_STATUSES,
    TRANSCRIPT_SPEAKERS,
} from '@constants/schemas.constants';

const transcriptTurnSchema = new Schema(
    {
        idx: {
            type: Number,
            required: true,
            min: 0,
        },
        speaker: {
            type: String,
            enum: TRANSCRIPT_SPEAKERS,
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        started_at: {
            type: Date,
            required: true,
        },
        ended_at: {
            type: Date,
            required: true,
        },
        question_id: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        is_follow_up: {
            type: Boolean,
            required: true,
            default: false,
        },
        client_turn_id: {
            type: String,
            default: null,
            trim: true,
        },
    },
    { _id: false },
);

const decisionLogEntrySchema = new Schema(
    {
        turn_idx: {
            type: Number,
            required: true,
            min: 0,
        },
        source: {
            type: String,
            enum: DECISION_SOURCES,
            required: true,
        },
        question_id: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        skills_detected: {
            type: [String],
            required: true,
            default: [],
        },
        topics_covered: {
            type: [String],
            required: true,
            default: [],
        },
        gaps: {
            type: [String],
            required: true,
            default: [],
        },
    },
    { _id: false },
);

const perSkillEvaluationSchema = new Schema(
    {
        skill: {
            type: String,
            required: true,
            trim: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        evidence: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
);

const idempotentTurnSchema = new Schema(
    {
        client_turn_id: {
            type: String,
            required: true,
            trim: true,
        },
        ai_text: {
            type: String,
            trim: true,
            default: '',
        },
        candidate_text: {
            type: String,
            trim: true,
            default: '',
        },
        ai_audio: {
            type: String,
            default: null,
        },
        ai_audio_content_type: {
            type: String,
            default: null,
            trim: true,
        },
        ai_speech_failed: {
            type: Boolean,
            default: false,
        },
        is_final: {
            type: Boolean,
            required: true,
        },
        question_count: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false },
);

const evaluationSchema = new Schema(
    {
        overall_score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        per_skill: {
            type: [perSkillEvaluationSchema],
            required: true,
            default: [],
        },
        strengths: {
            type: [String],
            required: true,
            default: [],
        },
        concerns: {
            type: [String],
            required: true,
            default: [],
        },
        summary: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
);

const interviewSchema = new Schema(
    {
        job_id: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        candidate_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: INTERVIEW_STATUSES,
            required: true,
            default: 'in_progress',
        },
        started_at: {
            type: Date,
            default: Date.now,
        },
        ended_at: {
            type: Date,
            default: null,
        },
        transcript: {
            type: [transcriptTurnSchema],
            default: [],
        },
        decision_log: {
            type: [decisionLogEntrySchema],
            default: [],
        },
        idempotent_turns: {
            type: [idempotentTurnSchema],
            default: [],
        },
        evaluation: {
            type: evaluationSchema,
            default: null,
        },
    },
    {
        collection: 'interviews',
        versionKey: false,
    },
);

interviewSchema.index(
    { candidate_id: 1 },
    { unique: true, partialFilterExpression: { status: 'in_progress' } },
);
interviewSchema.index({ candidate_id: 1, job_id: 1, status: 1 });
interviewSchema.index({ job_id: 1, status: 1, 'evaluation.overall_score': -1 });
interviewSchema.index({ candidate_id: 1, status: 1, ended_at: -1 });
interviewSchema.index({ candidate_id: 1, started_at: -1 });

export type Interview = InferSchemaType<typeof interviewSchema>;
export type InterviewDocument = HydratedDocument<Interview>;
export type InterviewModel = Model<Interview>;

export type TranscriptTurn = InferSchemaType<typeof transcriptTurnSchema>;
export type DecisionLogEntry = InferSchemaType<typeof decisionLogEntrySchema>;
export type IdempotentTurn = InferSchemaType<typeof idempotentTurnSchema>;
export type InterviewEvaluation = InferSchemaType<typeof evaluationSchema>;

export type InterviewJobId = Types.ObjectId;
export type InterviewCandidateId = Types.ObjectId;

export const interviewModel = model<Interview>('Interview', interviewSchema);
