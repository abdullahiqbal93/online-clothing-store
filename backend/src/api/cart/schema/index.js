import * as z from "zod";

const { object, string, number, array } = z;

export const cartItemSchema = object({
    productId: string().min(1, { message: "Product ID is required" }),
    quantity: number().min(1, { message: "Quantity must be at least 1" }),
    color: string().optional(),
    size: string().optional(),
});

export const cartSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    items: array(cartItemSchema).nonempty({ message: "Cart must have at least one item" }),
});

export const updateCartSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    productId: string().min(1, { message: "Product ID is required" }), 
    quantity: number().min(1, { message: "Quantity must be at least 1" }),
    color: string().optional(),
    size: string().optional(),
  }).strict();


export const insertCartSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    productId: string().min(1, { message: "Product ID is required" }), 
    quantity: number().min(1, { message: "Quantity must be at least 1" }),
    color: string().optional(),
    size: string().optional(),
  }).strict();

  export const deleteCartSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    productId: string().min(1, { message: "Product ID is required" }), 
    color: string().optional(),
    size: string().optional(),
  }).strict();


