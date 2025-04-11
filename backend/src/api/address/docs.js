import { addressSchema, updateAddressSchema, insertAddressSchema } from "@/api/address/schema/";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { getAuthDetails } from "@/lib/utils/swagger-docs";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getAddressRegistry = () => {
  const addressRegistry = new OpenAPIRegistry();

  const AddressIdSchema = addressRegistry.registerParameter(
    "Address ID",
    z.string().openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
      description: "ID from mongo db",
    }),
  );

  getAuthDetails(addressRegistry);

  addressRegistry.registerPath({
    description: "Create new address",
    method: "post",
    path: "/address",
    tags: ["Address"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertAddressSchema.openapi({
              required: ["userId", "address", "city", "postalcode", "phone"],
              default: { userId: "1234567890abcdef12345678", address: "123 Main St", city: "New York", postalcode: "10001", phone: "123-456-7890" },
            }),
          },
        },
        description: "Create new address, `userId`, `address`, `city`, `postalcode`, and `phone` fields are required",
      },
    },
    responses: createSuccessResponseForSwagger(addressSchema.openapi("Address")),
  });

  addressRegistry.registerPath({
    description: "Get all addresses",
    method: "get",
    path: "/address",
    tags: ["Address"],
    responses: createSuccessResponseForSwagger(addressSchema.array().openapi("Address")),
  });

  addressRegistry.registerPath({
    description: "Get address by id",
    method: "get",
    path: "/address/{id}",
    tags: ["Address"],
    request: {
      params: z.object({ id: AddressIdSchema }),
    },
    responses: createSuccessResponseForSwagger(addressSchema.openapi("Address")),
  });

  addressRegistry.registerPath({
    description: "Replace address by ID, will update address data",
    method: "put",
    path: "/address/{id}",
    tags: ["Address"],
    request: {
      params: z.object({ id: AddressIdSchema }),
      body: {
        content: {
          "application/json": {
            schema: addressSchema.openapi(),
          },
        },
        description: "The address data to update. All fields are optional",
        required: false,
      },
    },
    responses: createSuccessResponseForSwagger(addressSchema.openapi("Address")),
  });

  addressRegistry.registerPath({
    method: "delete",
    path: "/address/{id}",
    tags: ["Address"],
    request: {
      params: z.object({ id: AddressIdSchema }),
    },
    responses: createSuccessResponseForSwagger(z.object({ deleted: z.boolean() })),
    description: "Delete address by ID",
  });

  return addressRegistry;
};