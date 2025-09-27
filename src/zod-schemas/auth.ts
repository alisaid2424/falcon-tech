import { z } from "zod";

// Create Login Schema
export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email should be of type string",
    })
    .min(3, { message: "email should be at least 3 characters long" })
    .max(200, { message: "email should be less than 200 characters" })
    .email({ message: "email is not valid" }),

  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password should be of type string",
    })
    .min(6, { message: "password should be at least 6 characters long" }),
});

export type TLoginType = z.infer<typeof LoginSchema>;

// Create Register Schema
export const RegisterSchema = z
  .object({
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
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Password and Confirm Password does not match",
    path: ["confirmPassword"],
  });

export type TRegisterType = z.infer<typeof RegisterSchema>;
