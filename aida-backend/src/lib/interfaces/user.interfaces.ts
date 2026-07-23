import type { Types } from 'mongoose';

import type { User } from '@schemas/user.schema';

export interface UpsertGoogleUserRequest {
    googleSub: string;
    email: string;
    givenName: string;
    pictureUrl: string | null;
}

export interface GetUserByIdRequest {
    id: string;
}

export type UserWithId = User & { _id: Types.ObjectId };

export interface PublicUser {
    _id: Types.ObjectId;
    email: string;
    given_name: string;
    picture_url: string | null;
    created_at: Date;
}

export interface UserQuotaSummary {
    distinctRolesUsed: number;
    distinctRolesLimit: number;
    maxTriesPerRole: number;
}

export interface MeResponse extends PublicUser {
    quota: UserQuotaSummary;
}
