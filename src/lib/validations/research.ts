import { z } from "zod";

export const methodologySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  order: z.number().int().nonnegative(),
});

export const frameworkSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  order: z.number().int().nonnegative(),
  href: z.string().nonempty("Link URL is required"),
  linkText: z.string().nonempty("Link text is required"),
});

export const createMethodologySchema = methodologySchema;
export const updateMethodologySchema = methodologySchema.partial();

export const multipleMethodologiesSchema = z
  .object({
    methodologies: z
      .array(methodologySchema)
      .min(1, "At least one methodology is required"),
  })
  .refine(
    (data) => {
      const seen = new Set();
      for (const m of data.methodologies) {
        const normalized = m.title.trim().toLowerCase();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
      }
      return true;
    },
    {
      message:
        "Duplicate methodology titles are not allowed (case-insensitive).",
      path: ["methodologies"],
    }
  );

export const createFrameworkSchema = frameworkSchema;
export const updateFrameworkSchema = frameworkSchema.partial();

export const multipleFrameworksSchema = z
  .object({
    frameworks: z
      .array(frameworkSchema)
      .min(1, "At least one framework is required"),
  })
  .refine(
    (data) => {
      const seenTitles = new Set();
      for (const f of data.frameworks) {
        const normalizedTitle = f.title.trim().toLowerCase();
        if (seenTitles.has(normalizedTitle)) return false;
        seenTitles.add(normalizedTitle);
      }
      return true;
    },
    {
      message: "Duplicate framework titles are not allowed (case-insensitive).",
      path: ["frameworks"],
    }
  )
  .refine(
    (data) => {
      const seenHrefs = new Set();
      for (const f of data.frameworks) {
        const normalizedHref = f.href.trim().toLowerCase();
        if (seenHrefs.has(normalizedHref)) return false;
        seenHrefs.add(normalizedHref);
      }
      return true;
    },
    {
      message: "Duplicate framework URLs are not allowed (case-insensitive).",
      path: ["frameworks"],
    }
  );

// Type exports
export type Methodology = z.infer<typeof methodologySchema>;
export type Framework = z.infer<typeof frameworkSchema>;

export type CreateMethodologyPayload = z.infer<typeof createMethodologySchema>;
export type UpdateMethodologyPayload = z.infer<typeof updateMethodologySchema>;
export type MultipleMethodologiesPayload = z.infer<typeof multipleMethodologiesSchema>;

export type CreateFrameworkPayload = z.infer<typeof createFrameworkSchema>;
export type UpdateFrameworkPayload = z.infer<typeof updateFrameworkSchema>;
export type MultipleFrameworksPayload = z.infer<typeof multipleFrameworksSchema>;