import * as z from "zod";

const { object, string } = z;

export const addressSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    address: string().min(1, { message: "Address is required" }),
    city: string().min(1, { message: "City is required" }),
    postalcode: string().min(1, { message: "Postal code is required" }),
    phone: string().min(1, { message: "Phone number is required" }),
});

export const updateAddressSchema = addressSchema.partial().strict();
export const insertAddressSchema = addressSchema.strict();
