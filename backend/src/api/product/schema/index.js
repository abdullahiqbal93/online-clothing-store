import * as z from "zod";

const { object, string, array, coerce } = z;

const reviewSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    name: string().min(1, { message: "User name is required" }),
    reviewMessage: string().min(1, { message: "Review message cannot be empty" }),
    reviewValue: coerce.number().min(1, { message: "Review value must be at least 1" }).max(5, { message: "Review value must be at most 5" }),
});

export const productSchema = object({
    name: string().min(1, { message: "Product name is required" }),
    description: string().min(1, { message: "Product description is required" }),
    category: string().min(1, { message: "Product category is required" }),
    price: coerce.number().min(0, { message: "Price must be a positive number" }),
    salePrice: coerce.number().optional(),
    brand: string().optional(),
    totalStock: coerce.number().min(0, { message: "Total stock must be a non-negative number" }),
    variants: array(
        object({
            size: string().optional(),
            color: string().optional(),
            stock: coerce.number().min(0, { message: "Stock must be non-negative" }),
        })
    ),
    reviews: array(reviewSchema).optional(),
    averageRating: coerce.number().min(0).max(5).optional(),
    isActive: coerce.boolean().default(true),
});

export const updateProductSchema = productSchema.partial().strict();
export const insertProductSchema = productSchema.strict();
