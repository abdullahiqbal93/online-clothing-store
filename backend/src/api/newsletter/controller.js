import { Newsletter } from "@/api/newsletter/schema/model";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";
import { StatusCodes } from "http-status-codes";
import { sendNewsletterToAllUsers } from "@/lib/services/newsletter";

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isSubscribed: true }).select('email isSubscribed createdAt');
    createSuccessResponse(res, subscribers, StatusCodes.OK);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.isSubscribed) {
        return createErrorResponse(
          res,
          { message: "Email already subscribed" },
          StatusCodes.CONFLICT
        );
      }
      subscriber.isSubscribed = true;
      await subscriber.save();
    } else {
      subscriber = await Newsletter.create({ email });
    }

    createSuccessResponse(res, subscriber, StatusCodes.CREATED);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber || !subscriber.isSubscribed) {
      return createErrorResponse(
        res,
        { message: "Email not found or unsubscribed already" },
        StatusCodes.NOT_FOUND
      );
    }

    subscriber.isSubscribed = false;
    await subscriber.save();

    createSuccessResponse(res, null, StatusCodes.OK, "Successfully unsubscribed");
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const checkSubscription = async (req, res) => {
  try {
    const { email } = req.query;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return createErrorResponse(
        res,
        { message: "Email not found in subscription list" },
        StatusCodes.NOT_FOUND
      );
    }

    createSuccessResponse(res, { isSubscribed: subscriber.isSubscribed }, StatusCodes.OK);
  } catch (e) {
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    const result = await sendNewsletterToAllUsers({ subject, content });

    if (result.totalSubscribers === 0) {
      return createSuccessResponse(res, result, StatusCodes.OK, "No subscribers found to send newsletter");
    }

    createSuccessResponse(res,result,StatusCodes.OK,`Newsletter sent successfully to ${result.successCount} subscribers`);
  } catch (e) {
    mainLogger.error(logNames.db.error, e);
    createErrorResponse(res, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};