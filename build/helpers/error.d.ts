import { NextFunction, Request, Response } from "express";
/**
 * Class representing an API error.
 * @extends Error
 */
declare class APIError extends Error {
    status: number;
    isPublic: boolean;
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor(message: string, status?: number, isPublic?: boolean);
}
declare function errorFormatter(err: any, _req: Request, _res: Response, next: NextFunction): void;
declare function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void;
declare function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void;
export { APIError, notFoundHandler, errorFormatter, errorHandler };
