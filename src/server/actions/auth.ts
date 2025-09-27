"use server";

import bcrypt from "bcrypt";
import { LoginSchema, RegisterSchema, TRegisterType } from "@/zod-schemas/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Pages } from "@/constants/enums";

export const loginAction = async (
  credentials: Record<"email" | "password", string> | undefined
) => {
  const result = LoginSchema.safeParse(credentials);

  if (!result.success) {
    return { message: "Invalid Email Or Password", status: 400 };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user || !user.password) {
      return { message: "Invalid Email Or Password", status: 400 };
    }

    const isValidPassword = await bcrypt.compare(
      result.data.password,
      user.password
    );

    if (!isValidPassword) {
      return {
        message: "User Not Found",
        status: 400,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      status: 200,
      message: "Authenticated",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internal server error",
    };
  }
};

export const SignUpAction = async (data: TRegisterType) => {
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return { message: "Invalid Data", status: 400 };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (user) {
      return {
        status: 409,
        message: "User already exists.",
      };
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
      },
    });

    revalidatePath(Pages.USERS);
    revalidatePath(`${Pages.USERS}/${createdUser.id}/edit`);

    return {
      status: 201,
      message: "Account created successfully",
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internal server error",
    };
  }
};
