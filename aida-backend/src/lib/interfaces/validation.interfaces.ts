import type { ZodObject } from 'zod';

export interface ValidationSchema {
    body?: ZodObject;
    query?: ZodObject;
    params?: ZodObject;
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
