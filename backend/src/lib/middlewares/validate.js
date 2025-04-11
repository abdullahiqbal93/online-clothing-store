import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { StatusCodes } from "http-status-codes";

export const validateRequestBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (parsed.success) {
    return next();
  } else {
    const errorMessage = parsed.error.errors[0]?.message || "Validation Error";
    return createErrorResponse(
      res,
      parsed.error.errors,
      StatusCodes.BAD_REQUEST,
      errorMessage
    );
  }
};


export const validateRequestParams = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.params);
  if (parsed.success) {
    return next();
  } else {
    const data = parsed.error.errors.map((error) => ({
      ...error,
      field: error.path.join("."),
    }));
    req.headers.validation_errors = JSON.stringify(parsed.error.errors);
    return createErrorResponse(res, data, StatusCodes.NOT_ACCEPTABLE, "Request params Validation Error");
  }
};

export const validateRequestQuery = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.query);
  if (parsed.success) {
    return next();
  } else {
    const data = parsed.error.errors.map((error) => ({
      ...error,
      field: error.path.join("."),
    }));
    req.headers.validation_errors = JSON.stringify(parsed.error.errors);
    mainLogger.error(logNames.validation.error, parsed.error);
    return createErrorResponse(res, data, StatusCodes.NOT_FOUND, "Request query Validation Error");
  }
};
