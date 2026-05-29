import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "./custom-errors";
import { ErrorCodes } from "./error-codes";
import { NotFoundError } from "./custom-errors";

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
}

const formatErrorResponse = (
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
): ErrorResponse => ({
  success: false,
  error: {
    message,
    code,
    statusCode,
    ...(details !== undefined ? { details } : {}),
  },
});

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(
        formatErrorResponse(err.statusCode, err.code, err.message, err.details),
      );
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json(
      formatErrorResponse(
        400,
        ErrorCodes.VALIDATION_ERROR,
        "Validation failed",
        err.flatten(),
      ),
    );
    return;
  }

  if (err instanceof Error) {
    console.error("Unhandled error:", err);

    res.status(500).json(
      formatErrorResponse(
        500,
        ErrorCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
      ),
    );
    return;
  }

  console.error("Unknown error:", err);

  res.status(500).json(
    formatErrorResponse(
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      "Internal server error",
    ),
  );
};
