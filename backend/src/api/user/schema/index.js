import { validatePassword } from "@/lib/utils/password";
import * as z from "zod";

const { object, string, boolean } = z;

export const roles = z.enum(["user","admin", "super-admin"]);
export const title = z.enum(["Mr", "Mrs", "Miss", "Dr", "Prof"]);
export const gender = z.enum(["Male", "Female"]);

export const userSchema = object({
  name: string().min(1, { message: "Name is required" }),
  email: string().email({ message: "Valid email is required" }),
  password: string().min(6, { message: "Password is required and must be at least 6 characters" }),
  role: roles.optional(),
  avatar: string().optional(),
  phoneNumber: string().optional(),
  isActive: boolean().optional(),
});

export const updateUserSchema = userSchema.partial().omit({ password: true }).strict();

export const insertUserSchema = userSchema.strict().superRefine(validatePassword);

export const changePasswordSchema = object({
  currentPassword: string().min(1, "Current password is required"),
  newPassword: string().min(6, "New password must be at least 6 characters"),
})

export const loginSchema = object({
  email: string().email({ message: "Valid email is required" }),
  password: string(),
});

export const requestPasswordResetSchema = object({
  email: string().email({ message: "Valid email is required" }),
});

export const resetPasswordSchema = object({
  token: string().min(1, { message: "Reset token is required" }),
  password: string().min(6, { message: "Password must be at least 6 characters" }),
}).superRefine(validatePassword);

export const validateResetTokenSchema = object({
  token: string().min(1, { message: "Reset token is required" }),
});
