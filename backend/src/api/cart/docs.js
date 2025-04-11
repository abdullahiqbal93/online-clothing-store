import { cartSchema, updateCartSchema, insertCartSchema } from "@/api/cart/schema/";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { getAuthDetails } from "@/lib/utils/swagger-docs";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getCartRegistry = () => {
  const cartRegistry = new OpenAPIRegistry();

  const CartIdSchema = cartRegistry.registerParameter(
    "Cart ID",
    z.string().openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
      description: "ID from mongo db",
    }),
  );

  getAuthDetails(cartRegistry);

  cartRegistry.registerPath({
    description: "Create new cart",
    method: "post",
    path: "/cart",
    tags: ["Cart"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertCartSchema.openapi({
              required: ["userId", "items"],
              default: { userId: "1234567890abcdef12345678", items: [{ productId: "1234567890abcdef12345678", quantity: 1 }] },
            }),
          },
        },
        description: "Create new cart, `userId` and `items` fields are required",
      },
    },
    responses: createSuccessResponseForSwagger(cartSchema.openapi("Cart")),
  });

  cartRegistry.registerPath({
    description: "Get all carts",
    method: "get",
    path: "/cart",
    tags: ["Cart"],
    responses: createSuccessResponseForSwagger(cartSchema.array().openapi("Cart")),
  });

  cartRegistry.registerPath({
    description: "Get cart by id",
    method: "get",
    path: "/cart/{id}",
    tags: ["Cart"],
    request: {
      params: z.object({ id: CartIdSchema }),
    },
    responses: createSuccessResponseForSwagger(cartSchema.openapi("Cart")),
  });

  cartRegistry.registerPath({
    description: "Replace cart by ID, will update cart data",
    method: "put",
    path: "/cart/{id}",
    tags: ["Cart"],
    request: {
      params: z.object({ id: CartIdSchema }),
      body: {
        content: {
          "application/json": {
            schema: cartSchema.openapi(),
          },
        },
        description: "The cart data to update. All fields are optional",
        required: false,
      },
    },
    responses: createSuccessResponseForSwagger(cartSchema.openapi("Cart")),
  });

  cartRegistry.registerPath({
    method: "delete",
    path: "/cart/{id}",
    tags: ["Cart"],
    request: {
      params: z.object({ id: CartIdSchema }),
    },
    responses: createSuccessResponseForSwagger(z.object({ deleted: z.boolean() })),
    description: "Delete cart by ID",
  });

  return cartRegistry;
};