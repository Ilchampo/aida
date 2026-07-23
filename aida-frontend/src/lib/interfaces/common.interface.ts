export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    details?: Record<string, unknown>;
}

export interface ValidationErrorItem {
    field: string;
    message: string;
    code: string;
}

export interface ValidationErrorResponse {
    success: false;
    message: string;
    errors: ValidationErrorItem[];
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    totalPages: number;
    totalItems: number;
}
