import * as z from "zod";

const { object, string, array } = z;

export const wishlistSchema = object({
  userId: string().min(1, { message: "User ID is required" }),
  products: array(string()).nonempty({ message: "At least one product ID is required" }),
});

export const updateWishlistSchema = wishlistSchema.partial().strict();
export const insertWishlistSchema = wishlistSchema.strict();