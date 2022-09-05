import { CustomError as CustomErrorInterface } from "../interfaces/customErrorInterface";
import { ErrorType } from "../middlewares/errorHandlingMiddleware";

export class CustomError implements CustomErrorInterface {
  type: ErrorType;

  message: string;

  constructor(errorType: ErrorType, message: string) {
    this.type = errorType;
    this.message = message;
  }
}
