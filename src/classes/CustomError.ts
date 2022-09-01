import { ErrorType } from "../types/errorTypes";

export class CustomError {
  type: ErrorType;

  message: string;

  constructor(errorType: ErrorType, message: string) {
    this.type = errorType;
    this.message = message;
  }
}
