import { logNames } from "@/lib/logger/helper.js";
import { mainLogger } from "@/lib/logger/winston.js";

export class JWTError extends Error {
  constructor(message) {
    super(message);
    this.name = "JWTError";
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export const handleError = (err) => {
  const withMessage = err;

  if (withMessage.name === "MongoServerError") {
    if (withMessage.code === 11000) {
      mainLogger.error(logNames.db.error, withMessage);
      return "User with email already Exists";
    } else {
      mainLogger.error(logNames.db.error, withMessage);
      return "Mongo DB ERROR";
    }
  }
  if (err instanceof ValidationError) {
    return err.message;
  }
  if (err instanceof JWTError) {
    return err.message;
  }
  return withMessage.message ? withMessage.message : "Something went wrong";
};