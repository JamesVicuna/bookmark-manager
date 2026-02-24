import { ApiError } from "./errors";
import { NextResponse } from "next/server";

type ErrorResponse = {
  code: string;
  message: string;
  details?: unknown;
};

export function handleError(error: unknown) {
  console.error(error);

  if (error instanceof ApiError) {
    return NextResponse.json<ErrorResponse>({
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  return NextResponse.json<ErrorResponse>({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occured",
  });
}
