import { APIResponse } from "@/lib/response/response";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";

export function createErrorResponse(res, data, status = StatusCodes.INTERNAL_SERVER_ERROR, message = "Error") {
  return res.status(status).send(APIResponse.failure(message, data, status));
}

export const expressErrorHandler = (err, _, res) => {
  createErrorResponse(res, handleError(err));
};