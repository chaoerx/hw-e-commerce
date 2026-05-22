import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be 20 characters or less")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female"], {
    error: "Select a gender",
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
