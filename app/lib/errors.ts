
export class ApiError extends Error{
   constructor(
      public code: string,
      message: string,
      public status: number = 400,
      public details?: unknown
   ) {
      super(message)
      this.name = "ApiError"
   }
}

export class NotFoundError extends ApiError{
   constructor(resource: string, id?: string) {
      super(
         "NOT_FOUND",
         id ?
            `${resource} not found with with id: ${id}`
            : `${resource} not found`,
            404
      )
   
   }
}

export class ValidationError extends ApiError{
   constructor(message: string,
      public fields?: Record<string, string>
   ) {
      super("VALIDATION_ERROR", message, 400, fields)
   }
}

export class UnauthorizedError extends ApiError{
   constructor(message: "Authorization required") {
      super("UNAUTHORIZED", message, 401)
   }
}

export class DatabaseError extends ApiError{
   constructor(message: string) {
      super("DATABASE_ERROR", message, 500)
   }
}