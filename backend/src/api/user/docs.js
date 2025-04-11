import { userSchema, updateUserSchema, insertUserSchema } from "@/api/user/schema/";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { getAuthDetails } from "@/lib/utils/swagger-docs";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getUserRegistry = () => {
  const userRegistry = new OpenAPIRegistry();

  const UserIdSchema = userRegistry.registerParameter(
    "User ID",
    z.string().openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
      description: "ID from mongo db",
    }),
  );

  getAuthDetails(userRegistry);

  userRegistry.registerParameter(
    "User Query",
    z
      .string()
      .openapi({
        param: {
          name: "role",
          in: "query",
        },
        example: "user",
        description: "Search by role",
      })
      .optional(),
  );

  userRegistry.registerPath({
    description: "Create new user",
    method: "post",
    path: "/user",
    tags: ["User"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertUserSchema.openapi({
              required: ["name", "password"],
              default: { name: "John Doe", password: "P@ssw0rd" },
            }),
          },
        },
        description: "Create new user, `name` and `password` fields are required",
      },
    },
    responses: createSuccessResponseForSwagger(userSchema.openapi("User")),
  });

  userRegistry.registerPath({
    description: "Get all users",
    method: "get",
    path: "/user",
    tags: ["User"],
    security: [{ bearerAuth: [] }],
    responses: createSuccessResponseForSwagger(userSchema.array().openapi("User")),
  });

  userRegistry.registerPath({
    description: "Get user by id",
    method: "get",
    path: "/user/{id}",
    tags: ["User"],
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({ id: UserIdSchema }),
    },
    responses: createSuccessResponseForSwagger(userSchema.openapi("User")),
  });

  userRegistry.registerPath({
    description: "Replace user by ID, will update user data",
    method: "put",
    path: "/user/{id}",
    tags: ["User"],
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({ id: UserIdSchema }),
      body: {
        content: {
          "application/json": {
            schema: userSchema.openapi(),
          },
        },
        description: "The user data to update. All fields are optional",
        required: false,
      },
    },
    responses: createSuccessResponseForSwagger(userSchema.openapi("User")),
  });

  userRegistry.registerPath({
    method: "delete",
    path: "/user/{id}",
    tags: ["User"],
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({ id: UserIdSchema }),
    },
    responses: createSuccessResponseForSwagger(z.object({ deleted: z.boolean() })),
    description: "Delete user by ID",
  });

  return userRegistry;
};