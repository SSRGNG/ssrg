import { roles } from "@/config/constants";
import { z } from "zod";

const RoleEnum = z.enum(roles);

export const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema.shape.email,
  image: z.string().url().optional(),
  password: passwordSchema.shape.password,
  role: RoleEnum.default("member"),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true });

export const credentialsSchema = z.object({
  email: emailSchema.shape.email,
  password: passwordSchema.shape.password,
});

export type CredentialsPayload = z.infer<typeof credentialsSchema>;
export type EmailPayload = z.infer<typeof emailSchema>;
export type PasswordPayload = z.infer<typeof passwordSchema>;
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type UpdateUserPayload = z.infer<typeof updateUserSchema>;
