import * as z from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  isSubscribed: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const insertNewsletterSchema = newsletterSchema.pick({
  email: true,
});

export const updateNewsletterSchema = newsletterSchema.partial();

export const sendNewsletterSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject is too long'),
  content: z.string().min(1, 'Content is required').max(50000, 'Content is too long')
});