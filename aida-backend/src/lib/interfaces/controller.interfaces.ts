import type { CookieOptions, Request } from 'express';

export interface ResponseCookie {
    name: string;
    value: string;
    options: CookieOptions;
}

export interface ControllerResult<T> {
    statusCode?: number;
    data: T;
    cookie?: ResponseCookie;
    clearCookie?: string;
}

export type ControllerFn<T> = (req: Request) => Promise<ControllerResult<T>>;
