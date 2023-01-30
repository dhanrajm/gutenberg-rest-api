import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import logger from "./logger";

const log = logger("helpers:error");

/**
 * Intercept unhandled promise rejection and thow the same exception
 * This will be intercepted in the uncaughtException handler
 */
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p);
  throw new Error(`Unhandled promise rejection, ${reason}`);
});

/**
 * Intercept uncaughtException.
 * We are not handling any exit process. So just exit.
 * Other wise we could have called another function to do clean up and then exit
 */
process.on("uncaughtException", (err) => {
  console.log(`uncaught exception: ${err}`);
  console.log("Application encountered a critical error. Exiting");
  process.exit(1);
});

/**
 * Class representing an API error.
 * @extends Error
 */
class APIError extends Error {
  status: number;
  isPublic: boolean;
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Format the error and send the response back
 * @param err {any}
 * @param res {Response}
 */
function sendError(err: any, res: Response) {
  let code = null as string | null;
  let stack = null as string | null;
  let message = "something went wrong";
  let status = null;
  let isPublic = false;

  if (err instanceof APIError) {
    status = typeof err.status === "number" ? err.status : parseInt(err.status);
    stack = err.stack || null;
    message = err.message;
    isPublic = err.isPublic;
  } else if (err instanceof Error) {
    code = "500";
    stack = err.stack || null;
    message = err.message;
  }
  status = status || 500;

  let response: object = { message };
  if (
    config.server.env === "development" ||
    config.server.env === "staging" ||
    isPublic
  ) {
    response = { ...response, code, stack };
  }

  return res.status(status).send(response);
}

function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  log.extend("notFoundHandler")("%O", req.url);
  const err = new APIError("API not found", httpStatus.NOT_FOUND);
  return next(err);
}

function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  return sendError(err, res);
}
export { APIError, notFoundHandler, sendError, errorHandler };
