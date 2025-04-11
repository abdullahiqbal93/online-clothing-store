import { newsletterSchema, insertNewsletterSchema } from "@/api/newsletter/schema/";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getNewsletterRegistry = () => {
  const newsletterRegistry = new OpenAPIRegistry();

  newsletterRegistry.registerPath({
    description: "Subscribe to newsletter",
    method: "post",
    path: "/newsletter/subscribe",
    tags: ["Newsletter"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertNewsletterSchema.openapi({
              required: ["email"],
              default: { email: "user@example.com" },
            }),
          },
        },
        description: "Subscribe to newsletter with email address",
      },
    },
    responses: createSuccessResponseForSwagger(newsletterSchema.openapi("Newsletter")),
  });

  newsletterRegistry.registerPath({
    description: "Unsubscribe from newsletter",
    method: "post",
    path: "/newsletter/unsubscribe",
    tags: ["Newsletter"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertNewsletterSchema.openapi({
              required: ["email"],
              default: { email: "user@example.com" },
            }),
          },
        },
        description: "Unsubscribe email from newsletter",
      },
    },
    responses: createSuccessResponseForSwagger(z.object({ message: z.string() })),
  });

  newsletterRegistry.registerPath({
    description: "Check newsletter subscription status",
    method: "get",
    path: "/newsletter/check",
    tags: ["Newsletter"],
    request: {
      query: z.object({
        email: z.string().email().openapi({
          description: "Email to check subscription status",
          example: "user@example.com",
        }),
      }),
    },
    responses: createSuccessResponseForSwagger(
      z.object({ isSubscribed: z.boolean() }).openapi("SubscriptionStatus")
    ),
  });

  return newsletterRegistry;
};