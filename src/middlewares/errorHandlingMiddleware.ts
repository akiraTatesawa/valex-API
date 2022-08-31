import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

interface ErrorHandlerObject extends ErrorRequestHandler {
  type: string;
  message: string;
}

type Error = {
  status: number;
};

interface ErrorsType {
  [key: string]: Error;
}

export async function errorHandlingMiddleware(
  error: ErrorHandlerObject,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const Errors: ErrorsType = {
    error_bad_request: {
      status: 400,
    },
    error_unauthorized: {
      status: 401,
    },
    error_forbidden: {
      status: 403,
    },
    error_not_found: {
      status: 404,
    },
    error_conflict: {
      status: 409,
    },
    error_unprocessable_entity: {
      status: 422,
    },
  };
  console.log(error);
  const { message, type } = error;

  if (Errors[type]?.status) {
    const { status } = Errors[type];
    return res.status(status).send(message);
  }

  return res.sendStatus(500);
}
