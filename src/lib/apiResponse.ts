/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export class ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;

  constructor(statusCode: number, data?: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
  send() {
    return NextResponse.json(
      {
        success: this.success,
        message: this.message,
        data: this.data,
      },
      { status: this.statusCode }
    );
  }
  // doesnt need to use new
  static success(
    status: number = 200,
    data?: any,
    message: string = "Success"
  ) {
    return new ApiResponse(status, data, message).send();
  }

  static error(message: string = "Error occurred", statusCode: number = 500) {
    return new ApiResponse(statusCode, null, message).send();
  }

  static notFound(message: string = "Resource not found") {
    return new ApiResponse(404, null, message).send();
  }

  static unauthorized(message: string = "Not authenticated") {
    return new ApiResponse(401, null, message).send();
  }

  static badRequest(message: string = "Invalid request") {
    return new ApiResponse(400, null, message).send();
  }
}
