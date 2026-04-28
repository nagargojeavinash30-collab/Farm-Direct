import { NextResponse } from 'next/server';

export class APIResponse {
  static success(data: any, message: string = 'Success', statusCode: number = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: statusCode }
    );
  }

  static error(message: string, statusCode: number = 400, data?: any) {
    return NextResponse.json(
      {
        success: false,
        message,
        data,
      },
      { status: statusCode }
    );
  }

  static unauthorized(message: string = 'Unauthorized') {
    return this.error(message, 401);
  }

  static notFound(message: string = 'Not Found') {
    return this.error(message, 404);
  }

  static validationError(message: string, errors?: any) {
    return this.error(message, 422, { errors });
  }
}
