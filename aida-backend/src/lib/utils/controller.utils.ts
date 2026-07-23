import type { ControllerFn } from '@interfaces/controller.interfaces';
import type { Request, RequestHandler, Response, NextFunction } from 'express';

import { authCookieOptions } from '@utils/auth.utils';

export const controller = <T>(fn: ControllerFn<T>): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { statusCode = 200, data, cookie, clearCookie } = await fn(req);

            if (cookie) {
                res.cookie(cookie.name, cookie.value, cookie.options);
            }

            if (clearCookie) {
                res.clearCookie(clearCookie, authCookieOptions());
            }

            res.status(statusCode).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };
};
