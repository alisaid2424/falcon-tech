"use server";

import {
  CreateUserSchema,
  CreateUserType,
  UpdateUserSchema,
  UpdateUserType,
} from "@/zod-schemas/user";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/db";
import { getImageUrl } from "./getImageUrl";
import bcrypt from "bcrypt";
import { Pages, Routes } from "@/constants/enums";
import { revalidatePath } from "next/cache";

// created or updated  user
export const userAction = async (
  data: CreateUserType | UpdateUserType,
  mode: "create" | "update",
) => {
  const result =
    mode === "create"
      ? CreateUserSchema.safeParse(data)
      : UpdateUserSchema.safeParse(data);

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

  const imageUrl =
    typeof formData.image === "string"
      ? formData.image
      : formData.image instanceof File && formData.image.size > 0
        ? await getImageUrl({
            imageFile: formData.image,
            publicId: formData.image.name,
            pathName: "profile_images",
          })
        : undefined;

  try {
    if (mode === "create") {
      const user = await prisma.user.findUnique({
        where: {
          email: formData.email,
        },
      });

      if (user) {
        return {
          status: 409,
          message: "User already exists.",
        };
      }

      const hashedPassword = await bcrypt.hash(
        (formData as CreateUserType).password,
        10,
      );

      const newUser = await prisma.user.create({
        data: {
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          phone: formData.phone ?? "",
          streetAddress: formData.streetAddress ?? "",
          postalCode: formData.postalCode ?? "",
          city: formData.city ?? "",
          country: formData.country ?? "",
          image: imageUrl ?? "",
          role: formData.admin ? UserRole.ADMIN : UserRole.USER,
        },
      });

      revalidatePath(Pages.USERS);
      revalidatePath(`${Pages.USERS}/${newUser.id}/edit`);

      return {
        status: 201,
        message: `User created successfully (ID: ${newUser.id})`,
      };
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email: formData.email },
      });

      if (!existingUser) {
        return {
          status: 404,
          message: "User not found.",
        };
      }

      const updatedUser = await prisma.user.update({
        where: { email: existingUser.email },
        data: {
          name: formData.name,
          phone: formData.phone ?? "",
          streetAddress: formData.streetAddress ?? "",
          postalCode: formData.postalCode ?? "",
          city: formData.city ?? "",
          country: formData.country ?? "",
          image: imageUrl ?? existingUser.image,
          role: formData.admin ? UserRole.ADMIN : UserRole.USER,
        },
      });

      revalidatePath(Routes.PROFILE);
      revalidatePath(Routes.ADMIN);
      revalidatePath(Pages.USERS);
      revalidatePath(`${Pages.USERS}/${updatedUser.id}/edit`);

      return {
        status: 200,
        message: `User updated successfully (ID: ${updatedUser.id})`,
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
        targets.map((field) => [field, `${field} is already in use.`]),
      );

      return {
        status: 400,
        message: "Some fields must be unique.",
        error: errorObject,
      };
    }

    return {
      status: 500,
      message: "Internal server error while saving user.",
    };
  }
};

//delete user
export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    revalidatePath(Pages.USERS);
    revalidatePath(Pages.ORDERS);
    revalidatePath(Routes.ROOT);

    return {
      success: true,
      message: "User deleted successfull",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
