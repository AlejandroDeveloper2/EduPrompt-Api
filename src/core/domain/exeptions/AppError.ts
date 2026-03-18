/** Clase para errores personalizados */
export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;
  public readonly errorDetails?: unknown;

  constructor(
    name: string,
    httpCode: number,
    description: string,
    isOperational: boolean = true,
    errorDetails?: unknown,
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restaura la cadena de prototipo

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.errorDetails = errorDetails;

    Error.captureStackTrace(this, this.constructor);
  }
}
