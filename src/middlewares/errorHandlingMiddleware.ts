import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const Errors = {
  error_bad_request: {
    status: 400,
    name: "Error: Bad Request",
  },
  error_unauthorized: {
    status: 401,
    name: "Error: Unauthorized",
  },
  error_forbidden: {
    status: 403,
    name: "Error: Forbidden",
  },
  error_not_found: {
    status: 404,
    name: "Error: Not Found",
  },
  error_conflict: {
    status: 409,
    name: "Error: Conflict",
  },
  error_unprocessable_entity: {
    status: 422,
    name: "Error: Unprocessable Entity",
  },
  error_internal_server_error: {
    status: 500,
    name: "Error: Internal Server Error",
  },
};

export type ErrorType = keyof typeof Errors;

interface ErrorHandlerObject extends ErrorRequestHandler {
  type: ErrorType;
  message: string;
}

export async function errorHandlingMiddleware(
  error: ErrorHandlerObject,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const { message, type } = error;

  if (Errors[type]?.status) {
    const { status, name } = Errors[type];
    return res.status(status).json({ name, message });
  }

  return res.sendStatus(500);
}
