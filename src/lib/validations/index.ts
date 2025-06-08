import { z } from "zod";

import { DOI_REGEX, ORCID_REGEX } from "@/config/constants";

export const doiValidator = z
  .string()
  .optional()
  .nullable()
  .refine(
    (doi) => {
      if (!doi) return true; // Allow empty/null
      return DOI_REGEX.test(doi);
    },
    {
      message:
        "Invalid DOI format. DOI should start with '10.' followed by registrant code and suffix (e.g., 10.1000/182)",
    }
  );

export const orcidValidator = z
  .string()
  .optional()
  .nullable()
  .refine(
    (orcid) => {
      if (!orcid) return true;
      return ORCID_REGEX.test(orcid);
    },
    {
      message: "Invalid ORCID format. Should be in format: 0000-0000-0000-0000",
    }
  );
