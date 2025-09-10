import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceException extends HttpException {
  constructor(
    public readonly customMessage: string,
    public readonly originalError?: unknown
  ) {
    const normalizedError =
      originalError instanceof Error
        ? originalError
        : new Error(JSON.stringify(originalError));

    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: customMessage,
        originalError: normalizedError.message
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );

    this.stack = normalizedError.stack;
  }
}
