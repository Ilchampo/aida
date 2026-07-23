import type { AuthTokenPayload, GoogleIdentity } from '@interfaces/auth.interfaces';
import type { ResponseCookie } from '@interfaces/controller.interfaces';
import type { PublicUser, UserWithId } from '@lib/interfaces/user.interfaces';
import type { CookieOptions } from 'express';
import type { SignOptions } from 'jsonwebtoken';

import { SEVEN_DAYS_MS, AUTH_COOKIE_NAME } from '@constants/auth.constants';
import { UnauthorizedError } from '@utils/errors.utils';

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import config from '@lib/config';

const googleClient = new OAuth2Client(config.google.clientId);

export const authCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: config.app.env === 'production',
    sameSite: config.app.env === 'production' ? 'none' : 'strict',
});

export const authCookie = (token: string): ResponseCookie => ({
    name: AUTH_COOKIE_NAME,
    value: token,
    options: {
        ...authCookieOptions(),
        maxAge: SEVEN_DAYS_MS,
    },
});

export const verifyToken = (token: string): AuthTokenPayload =>
    jwt.verify(token, config.jwt.secret) as AuthTokenPayload;

export const toPublicUser = (user: UserWithId | PublicUser): PublicUser => ({
    _id: user._id,
    email: user.email,
    given_name: user.given_name,
    picture_url: user.picture_url ?? null,
    created_at: user.created_at,
});

export const generateToken = (user: PublicUser): string => {
    const payload: AuthTokenPayload = {
        sub: user._id.toString(),
        given_name: user.given_name,
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as SignOptions);
};

export const verifyGoogleIdToken = async (idToken: string): Promise<GoogleIdentity> => {
    if (!config.google.clientId) {
        throw new UnauthorizedError('Google sign-in is not configured');
    }

    let payload;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: config.google.clientId,
        });

        payload = ticket.getPayload();
    } catch {
        throw new UnauthorizedError('Invalid Google token');
    }

    if (!payload?.sub || !payload.email) {
        throw new UnauthorizedError('Invalid Google token');
    }

    const givenName =
        payload.given_name?.trim() ||
        payload.name?.trim().split(/\s+/)[0] ||
        payload.email.split('@')[0] ||
        'User';

    return {
        googleSub: payload.sub,
        email: payload.email,
        givenName,
        pictureUrl: payload.picture ?? null,
    };
};
