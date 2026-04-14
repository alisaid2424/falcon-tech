"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadImage from "../UploadImage";
import { useToast } from "@/hooks/use-toast";
import { Form } from "../ui/form";
import { InputWithLabel } from "../inputs/InputWithLabel";
import { CheckboxWithLabel } from "../inputs/CheckboxWithLabel";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import {
  CreateUserSchema,
  CreateUserType,
  UpdateUserSchema,
} from "@/zod-schemas/user";
import { userAction } from "@/server/actions/user";
import { Pages, Routes } from "@/constants/enums";

interface AppUser {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
  phone?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
}

interface UserFormProps {
  user?: AppUser;
}

const UserForm = ({ user }: UserFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isAdmin, setIsAdmin] = useState(user?.role === UserRole.ADMIN);
  const session = useSession();

  const isUpdate = Boolean(user);

  const schema = isUpdate ? UpdateUserSchema : CreateUserSchema;
  type SchemaType = typeof schema._type;

  const defaultValues: Partial<SchemaType> = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    ...(isUpdate ? {} : { password: "" }),
    phone: user?.phone ?? "",
    streetAddress: user?.streetAddress ?? "",
    postalCode: user?.postalCode ?? "",
    city: user?.city ?? "",
    country: user?.country ?? "",
    image: user?.image ?? "",
    admin: isAdmin,
  };

  const form = useForm<SchemaType>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    setValue,
    formState: { errors },
    setError,
    handleSubmit,
  } = form;

  const submitForm = (data: SchemaType) => {
    startTransition(async () => {
      try {
        const res = await userAction(data, isUpdate ? "update" : "create");

        if (res.status && res.message) {
          if (res.status === 200 || res.status === 201) {
            toast({
              title: "Success! 🎉",
              description: res.message,
              className: "bg-green-600 text-white",
            });

            if (session.data?.user.role === UserRole.ADMIN) {
              router.push(`${Pages.USERS}?pageNumber=1`);
            } else {
              router.push(Routes.PROFILE);
            }
          } else if (res.status === 400 && res.error) {
            Object.entries(res.error).forEach(([field, message]) => {
              if (field in defaultValues) {
                setError(field as keyof SchemaType, {
                  type: "server",
                  message,
                });
              }
            });

            toast({
              variant: "destructive",
              title: "Form Errors",
              description: "Please fix the highlighted fields.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: res.message,
            });
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
        });
      }
    });
  };

  return (
    <>
      <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
        {isUpdate ? "Profile" : "Create New User"}
      </h1>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-10"
        >
          <UploadImage<SchemaType>
            currentImage={user?.image ?? ""}
            altImage={user?.name ?? "User"}
            setValue={setValue}
            errors={errors}
            name="image"
          />

          <div className="flex flex-col space-y-4 flex-1">
            <InputWithLabel<SchemaType>
              fieldTitle="Name"
              nameInSchema="name"
              placeholder="Enter Your Username"
            />

            <InputWithLabel<SchemaType>
              fieldTitle="Email"
              nameInSchema="email"
              readOnly={isUpdate}
              placeholder="Enter Your Email"
            />

            {!isUpdate && (
              <InputWithLabel<CreateUserType>
                fieldTitle="Password"
                nameInSchema="password"
                placeholder="Enter Your Password"
                type="password"
              />
            )}

            <InputWithLabel<SchemaType>
              fieldTitle="Phone"
              nameInSchema="phone"
              placeholder="Enter Your Phone Number"
            />

            <InputWithLabel<SchemaType>
              fieldTitle="Street Address"
              nameInSchema="streetAddress"
              placeholder="Enter Your Address"
            />

            <InputWithLabel<SchemaType>
              fieldTitle="Postal Code"
              nameInSchema="postalCode"
              placeholder="Enter Your Postal Code"
            />

            <InputWithLabel<SchemaType>
              fieldTitle="City"
              nameInSchema="city"
              placeholder="Enter Your City"
            />

            <InputWithLabel<SchemaType>
              fieldTitle="Country"
              nameInSchema="country"
              placeholder="Enter Your Country"
            />

            {session.data?.user.role === UserRole.ADMIN && (
              <CheckboxWithLabel<SchemaType>
                fieldTitle="Admin"
                nameInSchema="admin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked)}
              />
            )}

            <Button
              type="submit"
              variant="default"
              className="hover:bg-teal-500 font-bold"
              title="Save"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                `${isUpdate ? "Edit User" : "Create User"}`
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserForm;
