import { z } from "zod";

import { partners, roles } from "@/config/enums";
import {
  researcherEducationSchema,
  researcherExpertiseSchema,
} from "@/lib/validations/researcher";

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

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema.shape.email,
  affiliation: z.string().optional().nullable(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  password: passwordSchema.shape.password,
  role: roles.schema.default("member"),
});

export const createUserSchema = userSchema
  .extend({
    confirmPassword: passwordSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const updateUserSchema = userSchema
  .partial()
  .omit({ password: true, email: true, role: true });

export const credentialsSchema = z.object({
  email: emailSchema.shape.email,
  password: passwordSchema.shape.password,
});

// export const signupSchema = userSchema
//   .extend({
//     partner: partnerSchema
//       .omit({ name: true })
//       .extend({
//         organization: z.string().min(2, "Name must be at least 2 characters"),
//       })
//       .optional(),
//     researcher: researcherSchema.omit({ userId: true }).optional(),
//     expertise: z.array(researcherExpertiseSchema).optional(),
//     education: z.array(researcherEducationSchema).optional(),
//   })

export const signupSchema = userSchema
  .extend({
    confirmPassword: passwordSchema.shape.password,

    // Researcher fields
    title: z.string().optional(),
    bio: z.string().optional(),
    expertise: z.array(researcherExpertiseSchema).optional(),
    education: z.array(researcherEducationSchema).optional(),
    x: z.string().optional(),
    orcid: z.string().optional(),

    // Partner fields
    organization: z.string().optional(),
    partnerType: z.enum(partners.values).optional(),
    description: z.string().optional(),
    website: z.string().url().optional(),
    logo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.role === "researcher") {
      if (!data.title) {
        ctx.addIssue({
          path: ["title"],
          code: z.ZodIssueCode.custom,
          message: "Title is required for researchers",
        });
      }
      if (!data.bio) {
        ctx.addIssue({
          path: ["bio"],
          code: z.ZodIssueCode.custom,
          message: "Bio is required for researchers",
        });
      }
    }

    if (data.role === "partner") {
      if (!data.organization) {
        ctx.addIssue({
          path: ["organization"],
          code: z.ZodIssueCode.custom,
          message: "Organization name is required for partners",
        });
      }
      if (!data.partnerType) {
        ctx.addIssue({
          path: ["partnerType"],
          code: z.ZodIssueCode.custom,
          message: "Partner type is required for partners",
        });
      }
    }
  });

export type CredentialsPayload = z.infer<typeof credentialsSchema>;
export type SignupPayload = z.infer<typeof signupSchema>;
export type EmailPayload = z.infer<typeof emailSchema>;
export type PasswordPayload = z.infer<typeof passwordSchema>;
export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type UpdateUserPayload = z.infer<typeof updateUserSchema>;
