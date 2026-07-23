import type {
    GetMeResponse,
    GoogleSignInRequest,
    GoogleSignInResponse,
    LogoutResponse,
} from '@lib/interfaces/auth.interface';

import { apiCaller } from '@lib/utils/apiCaller';

export const signInWithGoogle = (body: GoogleSignInRequest): Promise<GoogleSignInResponse> =>
    apiCaller<GoogleSignInResponse>({
        method: 'POST',
        url: '/auth/google',
        data: body,
    });

export const signOut = (): Promise<LogoutResponse> =>
    apiCaller<LogoutResponse>({
        method: 'POST',
        url: '/auth/logout',
    });

export const getMe = (): Promise<GetMeResponse> =>
    apiCaller<GetMeResponse>({
        method: 'GET',
        url: '/auth/me',
    });
