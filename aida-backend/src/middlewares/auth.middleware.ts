import type { AuthTokenPayload } from '@interfaces/auth.interfaces';
import type { NextFunction, Request, Response } from 'express';

import { verifyToken } from '@utils/auth.utils';
import { AUTH_COOKIE_NAME } from '@constants/auth.constants';
import { UnauthorizedError } from '@utils/errors.utils';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            auth?: AuthTokenPayload;
        }
    }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
    const token = (req.cookies as Record<string, string | undefined>)[AUTH_COOKIE_NAME];

    if (!token) {
        next(new UnauthorizedError('Authentication required'));
        return;
    }

    try {
        req.auth = verifyToken(token);
    } catch {
        next(new UnauthorizedError('Invalid or expired session'));
        return;
    }

    next();
};
