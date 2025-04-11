import * as z from "zod";

const { object, string } = z;

const phoneRegex = /^(?:\+?\d{1,3}[-. ]?)?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,4}$/;

export const profileSchema = object({
  name: string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  email: string()
    .email({ message: "Please enter a valid email address" })
    .optional(),
  phoneNumber: string()
    .regex(phoneRegex, { message: "Please enter a valid phone number" })
    .optional()
    .nullable()
});

export const passwordSchema = object({
  currentPassword: string()
    .min(6, { message: "Current password is required" }),
  newPassword: string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must not exceed 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: string()
    .min(1, { message: "Please confirm your password" })
});

export const passwordConfirmSchema = passwordSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);