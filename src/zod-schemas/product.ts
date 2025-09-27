import { z } from "zod";

const BaseProductSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name should be of type string",
    })
    .min(2, { message: "Name should be at least 2 characters long" })
    .max(200, { message: "Name should be less than 200 characters" }),

  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description should be of type string",
    })
    .min(10, { message: "Description should be at least 10 characters" })
    .max(1000, { message: "Description should be less than 1000 characters" }),

  price: z
    .string({
      required_error: "Price is required",
    })
    .min(1, { message: "Price is required" }),

  categoryId: z
    .string({
      required_error: "Category is required",
    })
    .min(1, { message: "Category is required" }),
  instantDelivery: z.boolean(),
});

// Schema for creating a product
export const CreateProductSchema = BaseProductSchema.extend({
  image: z.instanceof(File, {
    message: "Image is required and must be a valid file",
  }),
  stock: z.coerce
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be an integer")
    .min(0, { message: "Stock must be 0 or more" }),
});

// Schema for updating a product
export const UpdateProductSchema = BaseProductSchema.extend({
  id: z.string(),
  image: z.union([z.instanceof(File), z.string(), z.literal("")]).optional(),
  stock: z.coerce
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be a number",
    })
    .int("Stock must be an integer")
    .min(0, { message: "Stock must be 0 or more" })
    .optional(),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;
export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
