import type { AuthResult, GoogleSignInParams } from '@interfaces/auth.interfaces';

import { generateToken, toPublicUser, verifyGoogleIdToken } from '@utils/auth.utils';

import * as userService from '@services/user.services';

export const signInWithGoogle = async (params: GoogleSignInParams): Promise<AuthResult> => {
    const identity = await verifyGoogleIdToken(params.idToken);
    const createdUser = await userService.upsertGoogleUser(identity);
    const user = toPublicUser(createdUser);

    return { user, token: generateToken(user) };
};
