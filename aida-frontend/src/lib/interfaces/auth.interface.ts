import type { MeUser, PublicUser } from '@lib/interfaces/user.interface';

export interface GoogleSignInRequest {
    idToken: string;
}

export type GoogleSignInResponse = PublicUser;
export type GetMeResponse = MeUser;
export type LogoutResponse = null;
