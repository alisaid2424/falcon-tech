import { z } from "zod";

// Create New User Schema
export const CreateUserSchema = z.object({
  name: z
    .string({
      required_error: "username is required",
      invalid_type_error: "username should be of type string",
    })
    .min(3, { message: "username should be at least 3 characters long" })
    .max(50, { message: "username should be less 50 characters" }),
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email should be of type string",
    })
    .min(3, { message: "email should be at least 3 characters long" })
    .max(200, { message: "email should be less 200 characters" })
    .email({ message: "email is not valid" }),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password should be of type string",
    })
    .min(6, { message: "password should be at least 6 characters long" })
    .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
      message: "Password should contain at least 1 special character",
    }),
  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .trim()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\+?[1-9]\d{1,14}$/.test(value);
      },
      {
        message: "Please enter a valid phone number",
      }
    ),
  streetAddress: z
    .string({
      required_error: "Address is required",
    })
    .optional(),
  postalCode: z
    .string({
      required_error: "Postal code is required",
    })
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\d{5,10}$/.test(value);
      },
      {
        message: "Please enter a valid postal code",
      }
    ),
  city: z
    .string({
      required_error: "City is required",
    })
    .optional(),
  country: z
    .string({
      required_error: "Country is required",
    })
    .optional(),
  image: z.union([z.instanceof(File), z.string(), z.literal("")]).optional(),
  admin: z.boolean().optional(),
});

// Update User Schema
export const UpdateUserSchema = CreateUserSchema.omit({ password: true });

export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
