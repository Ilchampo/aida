import type { GoogleSignInParams } from '@interfaces/auth.interfaces';
import type { MeResponse } from '@interfaces/user.interfaces';

import { controller } from '@utils/controller.utils';
import { authCookie, toPublicUser } from '@utils/auth.utils';
import { AUTH_COOKIE_NAME } from '@constants/auth.constants';
import { UnauthorizedError } from '@utils/errors.utils';
import {
    INTERVIEW_MAX_COMPLETED_TRIES_PER_ROLE,
    INTERVIEW_MAX_DISTINCT_ROLES,
} from '@constants/interviews.constants';

import * as authService from '@services/auth.services';
import * as interviewService from '@services/interview.services';
import * as userService from '@services/user.services';

export const signInWithGoogle = controller(async (req) => {
    const { user, token } = await authService.signInWithGoogle(req.body as GoogleSignInParams);

    return { statusCode: 200, data: user, cookie: authCookie(token) };
});

export const logout = controller(async (_req) => {
    return { statusCode: 200, data: null, clearCookie: AUTH_COOKIE_NAME };
});

export const me = controller(async (req) => {
    if (!req.auth) {
        throw new UnauthorizedError('Authentication required');
    }

    const user = await userService.getUserById({ id: req.auth.sub });
    const distinctRolesUsed = await interviewService.countDistinctCompletedRoles(req.auth.sub);

    const data: MeResponse = {
        ...toPublicUser(user),
        quota: {
            distinctRolesUsed,
            distinctRolesLimit: INTERVIEW_MAX_DISTINCT_ROLES,
            maxTriesPerRole: INTERVIEW_MAX_COMPLETED_TRIES_PER_ROLE,
        },
    };

    return { statusCode: 200, data };
});
