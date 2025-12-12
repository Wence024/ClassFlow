import { z } from "zod";

export const patientFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required"),
  gender: z
    .string()
    .optional(),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  emergency_contact_name: z
    .string()
    .trim()
    .max(100, "Emergency contact name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  emergency_contact_phone: z
    .string()
    .trim()
    .max(20, "Emergency contact phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  insurance_provider: z
    .string()
    .trim()
    .max(100, "Insurance provider must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  insurance_policy_number: z
    .string()
    .trim()
    .max(50, "Policy number must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  allergies: z
    .string()
    .trim()
    .max(1000, "Allergies must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  medical_history: z
    .string()
    .trim()
    .max(2000, "Medical history must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
