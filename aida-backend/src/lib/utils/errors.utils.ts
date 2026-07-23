import { MONGO_DUPLICATE_KEY_CODE } from '@constants/error.constants';
export class AppError extends Error {
    readonly statusCode: number;
    readonly details?: Record<string, unknown>;

    constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;

        if (details !== undefined) {
            this.details = details;
        }
    }
}

export class ConflictError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 409, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message: string) {
        super(message, 422);
    }
}

export const isMongoDuplicateKeyError = (error: unknown): boolean =>
    error instanceof Error &&
    'code' in error &&
    (error as { code?: number }).code === MONGO_DUPLICATE_KEY_CODE;
