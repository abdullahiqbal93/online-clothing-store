import { orderSchema, updateOrderSchema, insertOrderSchema } from "@/api/order/schema/";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { getAuthDetails } from "@/lib/utils/swagger-docs";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getOrderRegistry = () => {
  const orderRegistry = new OpenAPIRegistry();

  const OrderIdSchema = orderRegistry.registerParameter(
    "Order ID",
    z.string().openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
      description: "ID from mongo db",
    }),
  );

  getAuthDetails(orderRegistry);

  orderRegistry.registerPath({
    description: "Create new order",
    method: "post",
    path: "/order",
    tags: ["Order"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertOrderSchema.openapi({
              required: ["userId", "cartId", "cartItems", "shippingAddress", "paymentMethod", "totalAmount"],
              default: { userId: "1234567890abcdef12345678", cartId: "1234567890abcdef12345678", cartItems: [{ productId: "1234567890abcdef12345678", name: "Product Name", image: "http://example.com/image.jpg", price: 100, quantity: 1 }], shippingAddress: { addressId: "1234567890abcdef12345678", address: "123 Main St", city: "New York", postalcode: "10001", phone: "123-456-7890" }, paymentMethod: "Card", totalAmount: 100 },
            }),
          },
        },
        description: "Create new order, `userId`, `cartId`, `cartItems`, `shippingAddress`, `paymentMethod`, and `totalAmount` fields are required",
      },
    },
    responses: createSuccessResponseForSwagger(orderSchema.openapi("Order")),
  });

  orderRegistry.registerPath({
    description: "Get all orders",
    method: "get",
    path: "/order",
    tags: ["Order"],
    responses: createSuccessResponseForSwagger(orderSchema.array().openapi("Order")),
  });

  orderRegistry.registerPath({
    description: "Get order by id",
    method: "get",
    path: "/order/{id}",
    tags: ["Order"],
    request: {
      params: z.object({ id: OrderIdSchema }),
    },
    responses: createSuccessResponseForSwagger(orderSchema.openapi("Order")),
  });

  orderRegistry.registerPath({
    description: "Replace order by ID, will update order data",
    method: "put",
    path: "/order/{id}",
    tags: ["Order"],
    request: {
      params: z.object({ id: OrderIdSchema }),
      body: {
        content: {
          "application/json": {
            schema: orderSchema.openapi(),
          },
        },
        description: "The order data to update. All fields are optional",
        required: false,
      },
    },
    responses: createSuccessResponseForSwagger(orderSchema.openapi("Order")),
  });

  orderRegistry.registerPath({
    method: "delete",
    path: "/order/{id}",
    tags: ["Order"],
    request: {
      params: z.object({ id: OrderIdSchema }),
    },
    responses: createSuccessResponseForSwagger(z.object({ deleted: z.boolean() })),
    description: "Delete order by ID",
  });

  return orderRegistry;
};