"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {  useTransition } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Pages, Routes } from "@/constants/enums";
import { LoginSchema, TLoginType } from "@/zod-schemas/auth";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContinueWithGoogle from "@/components/ContinueWithGoogle";
import { BackButton } from "@/components/BackButton";

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Initialize react-hook-form
  const defaultValues: TLoginType = {
    email: "",
    password: "",
  };

  const form = useForm<TLoginType>({
    mode: "onBlur",
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const submitForm =  (data: TLoginType) => {
    startTransition(async ()=>{
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        const responseError = JSON.parse(res?.error).responseError;
        if (responseError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: responseError,
          });
        }
      }
      if (res?.ok) {
        toast({
          title: "Success! 🎉",
          description: "Login successful",
          className: "bg-green-500 text-white",
        });

        router.replace(`${Routes.PROFILE}`);
        router.refresh();
      }
    } catch (error) {
      toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Something went wrong",
      });
    } 
  })
};

  return (
    <main className="w-full min-h-dvh flex flex-col items-center justify-center px-3">
      <BackButton
        title="Go Back"
        variant="default"
        className="rounded-full mb-10"
      />
      <div className="w-full max-w-md space-y-5 px-6 py-5 rounded-md bg-white lg:bg-transparent text-gray-900 lg:text-accent lg:border shadow-lg">
        <div className="text-center pb-8 mx-auto">
          <h3 className="text-accent lg:text-foreground text-2xl font-bold sm:text-3xl">
            Welcome Back
          </h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-5">
            <InputWithLabel<TLoginType>
              fieldTitle="Email"
              nameInSchema="email"
            />

            <InputWithLabel<TLoginType>
              fieldTitle="Password"
              nameInSchema="password"
              type="password"
            />

            <Button
              type="submit"
              className="w-full hover:bg-teal-500"
              variant="default"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <ContinueWithGoogle />

        <p className="element-center gap-2">
          Don&apos;t have an account?
          <Link
            href={Pages.Register}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignInForm;
