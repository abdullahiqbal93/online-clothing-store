import { subscribe, unsubscribe, checkSubscription, sendNewsletter, getSubscribers } from "@/api/newsletter/controller";
import { insertNewsletterSchema, sendNewsletterSchema } from "@/api/newsletter/schema/index";
import { validateRequestBody } from "@/lib/middlewares/validate";

export const newsletter = (router) => {
  router.post(
    "/newsletter/subscribe",
    validateRequestBody(insertNewsletterSchema),
    subscribe
  );

  router.post(
    "/newsletter/unsubscribe",
    validateRequestBody(insertNewsletterSchema),
    unsubscribe
  );

  router.get("/newsletter/check", checkSubscription);

  router.post(
    "/newsletter/send",
    validateRequestBody(sendNewsletterSchema),
    sendNewsletter
  );

  router.get("/newsletter/subscribers", getSubscribers);

  return router;
};