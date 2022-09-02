import { ErrorType } from "../types/errorTypes";
import { CustomError as CustomErrorInterface } from "../interfaces/customErrorInterface";

export class CustomError implements CustomErrorInterface {
  type: ErrorType;

  message: string;

  constructor(errorType: ErrorType, message: string) {
    this.type = errorType;
    this.message = message;
  }
}
