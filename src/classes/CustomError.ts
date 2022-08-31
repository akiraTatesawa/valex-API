export class CustomError {
  type: string;

  message: string;

  constructor(errorType: string, message: string) {
    this.type = errorType;
    this.message = message;
  }
}
