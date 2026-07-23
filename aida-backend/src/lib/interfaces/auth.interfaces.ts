import type { PublicUser } from '@lib/interfaces/user.interfaces';

export interface GoogleSignInParams {
    idToken: string;
}

export interface GoogleIdentity {
    googleSub: string;
    email: string;
    givenName: string;
    pictureUrl: string | null;
}

export interface AuthTokenPayload {
    sub: string;
    given_name: string;
}

export interface AuthResult {
    user: PublicUser;
    token: string;
}
