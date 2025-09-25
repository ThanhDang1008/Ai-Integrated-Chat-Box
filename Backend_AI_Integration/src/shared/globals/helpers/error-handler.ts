export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = 400;
  status = "error";

  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status;
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status;
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = 413;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status;
  }
}

export class ServerError extends CustomError {
  statusCode = 500;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "INTERNAL_SERVER_ERROR";
  }
}

export class TooManyRequestError extends CustomError {
  statusCode = 429;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "TOO_MANY_REQUESTS";
  }
}
