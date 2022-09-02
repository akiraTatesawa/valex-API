import { ErrorType } from "../types/errorTypes";

export interface CustomError {
  type: ErrorType;

  message: string;
}
