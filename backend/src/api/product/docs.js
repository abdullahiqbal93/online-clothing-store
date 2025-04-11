import { productSchema, updateProductSchema, insertProductSchema } from "@/api/product/schema/";
import { createSuccessResponseForSwagger } from "@/lib/services/success";
import { getAuthDetails } from "@/lib/utils/swagger-docs";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as z from "zod";

extendZodWithOpenApi(z);

export const getProductRegistry = () => {
  const productRegistry = new OpenAPIRegistry();

  const ProductIdSchema = productRegistry.registerParameter(
    "Product ID",
    z.string().openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "1212121",
      description: "ID from mongo db",
    }),
  );

  getAuthDetails(productRegistry);

  productRegistry.registerPath({
    description: "Create new product",
    method: "post",
    path: "/product",
    tags: ["Product"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertProductSchema.openapi({
              required: ["name", "description", "category", "price", "totalStock", "image"],
              default: { name: "Product Name", description: "Product Description", category: "Category", price: 100, totalStock: 10, image: ["http://example.com/image.jpg"] },
            }),
          },
        },
        description: "Create new product, `name`, `description`, `category`, `price`, `totalStock`, and `image` fields are required",
      },
    },
    responses: createSuccessResponseForSwagger(productSchema.openapi("Product")),
  });

  productRegistry.registerPath({
    description: "Get all products",
    method: "get",
    path: "/product",
    tags: ["Product"],
    responses: createSuccessResponseForSwagger(productSchema.array().openapi("Product")),
  });

  productRegistry.registerPath({
    description: "Get product by id",
    method: "get",
    path: "/product/{id}",
    tags: ["Product"],
    request: {
      params: z.object({ id: ProductIdSchema }),
    },
    responses: createSuccessResponseForSwagger(productSchema.openapi("Product")),
  });

  productRegistry.registerPath({
    description: "Replace product by ID, will update product data",
    method: "put",
    path: "/product/{id}",
    tags: ["Product"],
    request: {
      params: z.object({ id: ProductIdSchema }),
      body: {
        content: {
          "application/json": {
            schema: productSchema.openapi(),
          },
        },
        description: "The product data to update. All fields are optional",
        required: false,
      },
    },
    responses: createSuccessResponseForSwagger(productSchema.openapi("Product")),
  });

  productRegistry.registerPath({
    method: "delete",
    path: "/product/{id}",
    tags: ["Product"],
    request: {
      params: z.object({ id: ProductIdSchema }),
    },
    responses: createSuccessResponseForSwagger(z.object({ deleted: z.boolean() })),
    description: "Delete product by ID",
  });

  return productRegistry;
};