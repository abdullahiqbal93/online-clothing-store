import * as z from "zod";

const { object, string } = z;

const phoneRegex = /^(?:\+?\d{1,3}[-. ]?)?(\(?\d{1,4}\)?[-. ]?)?(\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,4})$/;
const postalCodeRegex = /^([A-Za-z0-9]{3,10}([ -]?[A-Za-z0-9]{3,10})*)$/;

export const addressSchema = object({
    userId: string().min(1, { message: "User ID is required" }),
    address: string()
        .min(5, { message: "Address must be at least 5 characters" })
        .max(100, { message: "Address must not exceed 100 characters" }),
    city: string()
        .min(2, { message: "City must be at least 2 characters" })
        .max(50, { message: "City must not exceed 50 characters" }),
    postalcode: string()
        .regex(postalCodeRegex, { message: "Please enter a valid postal code" })
        .min(3, { message: "Postal code must be at least 3 characters" }),
    phone: string()
        .regex(phoneRegex, { message: "Please enter a valid phone number" })
});

export const updateAddressSchema = addressSchema.partial().strict();
export const insertAddressSchema = addressSchema.strict();
