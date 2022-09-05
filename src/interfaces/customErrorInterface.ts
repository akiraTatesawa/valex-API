import { ErrorType } from "../middlewares/errorHandlingMiddleware";

export interface CustomError {
  type: ErrorType;

  message: string;
}
