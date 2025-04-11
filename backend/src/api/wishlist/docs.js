import { wishlistSchema } from "@/api/wishlist/schema";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getWishlistRegistry = () => {
  const wishlistRegistry = new OpenAPIRegistry();

  wishlistRegistry.registerPath({
    description: "Add a product to the wishlist",
    method: "post",
    path: "/wishlist",
    tags: ["Wishlist"],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: wishlistSchema.openapi({
              required: ["userId", "products"],
              default: { userId: "12345", products: ["67890"] },
            }),
          },
        },
        description: "Add a product to the wishlist",
      },
    },
    responses: createSuccessResponseForSwagger(wishlistSchema.openapi("Wishlist")),
  });

  wishlistRegistry.registerPath({
    description: "Remove a product from the wishlist",
    method: "delete",
    path: "/wishlist",
    tags: ["Wishlist"],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: wishlistSchema.openapi({
              required: ["userId", "products"],
              default: { userId: "12345", products: ["67890"] },
            }),
          },
        },
        description: "Remove a product from the wishlist",
      },
    },
    responses: createSuccessResponseForSwagger(z.object({ deleted: z.boolean() })),
  });

  wishlistRegistry.registerPath({
    description: "Get a user's wishlist",
    method: "get",
    path: "/wishlist/{userId}",
    tags: ["Wishlist"],
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        userId: z.string().openapi({
          param: {
            name: "userId",
            in: "path",
          },
          example: "12345",
          description: "User ID",
        }),
      }),
    },
    responses: createSuccessResponseForSwagger(wishlistSchema.array().openapi("Wishlist")),
  });

  return wishlistRegistry;
};