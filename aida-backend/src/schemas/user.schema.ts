import type { HydratedDocument, InferSchemaType, Model } from 'mongoose';

import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        google_sub: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        given_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        picture_url: {
            type: String,
            default: null,
            trim: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: 'users',
        versionKey: false,
    },
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;

export const userModel = model<User>('User', userSchema);
