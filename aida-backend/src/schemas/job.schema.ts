import type { HydratedDocument, InferSchemaType, Model } from 'mongoose';

import { Schema, model } from 'mongoose';
import {
    JOB_ROLES,
    QUESTION_CATEGORIES,
    RUBRIC_WEIGHT_MAX,
    RUBRIC_WEIGHT_MIN,
} from '@constants/schemas.constants';

const rubricItemSchema = new Schema(
    {
        skill: {
            type: String,
            required: true,
            trim: true,
        },
        weight: {
            type: Number,
            required: true,
            min: RUBRIC_WEIGHT_MIN,
            max: RUBRIC_WEIGHT_MAX,
        },
        signals: {
            type: [String],
            required: true,
            default: [],
        },
    },
    { _id: false },
);

const followUpSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        trigger_hint: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
);

const questionBankItemSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: QUESTION_CATEGORIES,
        required: true,
    },
    skill: {
        type: String,
        required: true,
        trim: true,
    },
    follow_ups: {
        type: [followUpSchema],
        default: [],
    },
});

const jobSchema = new Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: JOB_ROLES,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: [String],
            required: true,
            default: [],
        },
        rubric: {
            type: [rubricItemSchema],
            required: true,
            default: [],
        },
        question_bank: {
            type: [questionBankItemSchema],
            required: true,
            default: [],
        },
    },
    {
        collection: 'jobs',
        versionKey: false,
    },
);

jobSchema.index({ role: 1 });

export type Job = InferSchemaType<typeof jobSchema>;
export type JobDocument = HydratedDocument<Job>;
export type JobModel = Model<Job>;

export const jobModel = model<Job>('Job', jobSchema);
