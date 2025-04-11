import { mainLogger } from "@/lib/logger/winston.js";

export const updatedByValues = async (request, _, next) => {
  try {
    request.body.updatedAt = new Date();
    request.body.updatedBy = request.body.decoded?.payload.id;
    next();
  } catch (error) {
    mainLogger.error("Error setting updatedBy values:", error);
    next(error);
  }
};

export const createdByValues = async (request, _, next) => {
  try {
    request.body.createdBy = request.body.decoded?.payload.id;
    next();
  } catch (error) {
    mainLogger.error("Error setting createdBy values:", error);
    next(error);
  }
};