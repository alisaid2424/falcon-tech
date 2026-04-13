"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { Pages, Routes } from "@/constants/enums";
import { getImageUrl } from "./getImageUrl";
import {
  CreateProductSchema,
  CreateProductType,
  UpdateProductSchema,
  UpdateProductType,
} from "@/zod-schemas/product";

// create new product or updated product
export const productAction = async (
  data: CreateProductType | UpdateProductType,
  mode: "create" | "update",
) => {
  const result =
    mode === "create"
      ? CreateProductSchema.safeParse(data)
      : UpdateProductSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      status: 400,
      message: "Validation failed",
      error: fieldErrors,
    };
  }

  const formData = result.data;
  const price = Number(formData.price);

  const imageUrl =
    typeof formData.image === "string"
      ? formData.image
      : formData.image instanceof File && formData.image.size > 0
        ? await getImageUrl({
            imageFile: formData.image,
            publicId: formData.image.name,
            pathName: "product_images",
          })
        : undefined;

  try {
    if (mode === "create") {
      // formData is CreateProductType
      const newProduct = await prisma.product.create({
        data: {
          name: formData.name,
          description: formData.description,
          price,
          categoryId: formData.categoryId,
          image: imageUrl ?? "",
          instantDelivery: formData.instantDelivery ?? false,
          stock: formData.stock,
        },
      });

      revalidatePath(Pages.PRODUCTS);
      revalidatePath(Pages.CATEGORIES);
      revalidatePath(Routes.ROOT);

      return {
        status: 201,
        message: `Product created successfully (ID: ${newProduct.id})`,
      };
    } else {
      const updateData = formData as UpdateProductType;

      const existingProduct = await prisma.product.findUnique({
        where: { id: updateData.id },
      });

      if (!existingProduct) {
        return {
          status: 404,
          message: "Product not found",
        };
      }

      const updatedProduct = await prisma.product.update({
        where: { id: updateData.id },
        data: {
          name: updateData.name,
          description: updateData.description,
          price,
          categoryId: updateData.categoryId,
          image: imageUrl ?? existingProduct.image,
          instantDelivery: updateData.instantDelivery ?? false,
          stock: updateData.stock,
        },
      });

      revalidatePath(Pages.PRODUCTS);
      revalidatePath(Pages.CATEGORIES);
      revalidatePath(`${Pages.PRODUCTS}/${updatedProduct.id}/edit`);
      revalidatePath(Routes.ROOT);

      return {
        status: 200,
        message: `Product updated successfully (ID: ${updatedProduct.id})`,
      };
    }
  } catch (error) {
    console.error("Server Error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const targets = error.meta?.target as string[];

      const errorObject = Object.fromEntries(
        targets.map((field) => [field, `${field} must be unique.`]),
      );

      return {
        status: 400,
        message: "Some fields must be unique.",
        error: errorObject,
      };
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

//delete Product
export const deleteProduct = async (id: string) => {
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath(Pages.PRODUCTS);
    revalidatePath(Pages.CATEGORIES);
    revalidatePath(Routes.ROOT);

    return {
      success: true,
      message: "Product deleted successfull",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "internal server error",
    };
  }
};
