import type { NextFunction, Request, Response } from 'express';

import { AppError } from '@utils/errors.utils';
import { MONGO_DUPLICATE_KEY_CODE } from '@constants/error.constants';

const isMongoDuplicateKeyError = (error: Error): boolean =>
    'code' in error && (error as { code?: number }).code === MONGO_DUPLICATE_KEY_CODE;

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(error.details !== undefined ? { details: error.details } : {}),
        });

        return;
    }

    if (isMongoDuplicateKeyError(error)) {
        res.status(409).json({
            success: false,
            message: 'Resource already exists',
        });

        return;
    }

    console.error('Unhandled error:', error);

    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
};
