"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { RegisterSchema, TRegisterType } from "@/zod-schemas/auth";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Pages } from "@/constants/enums";
import { SignUpAction } from "@/server/actions/auth";
import ContinueWithGoogle from "@/components/ContinueWithGoogle";
import { BackButton } from "@/components/BackButton";

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
   const [isPending, startTransition] = useTransition();

  // Initialize react-hook-form
  const defaultValues: TRegisterType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm<TRegisterType>({
    mode: "onBlur",
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const submitForm =  (data: TRegisterType) => {
    startTransition(async()=>{
      try {
      const res = await SignUpAction(data);
      if (res.status && res.message) {
        if (res.status === 201) {
          toast({
            title: "Success! 🎉",
            description: res.message,
            className: "bg-green-500 text-white",
          });

          router.replace(Pages.LOGIN);
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
    })
  };

  return (
    <main className="w-full min-h-dvh flex flex-col items-center justify-center px-3 pb-10">
      <BackButton
        title="Go Back"
        variant="default"
        className="rounded-full max-sm:mb-4 mb-8"
      />
      <div className="w-full max-w-md space-y-5 px-6 py-5 rounded-md bg-white lg:bg-transparent text-gray-900 lg:text-accent lg:border shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-5">
            <InputWithLabel<TRegisterType>
              fieldTitle="Name"
              nameInSchema="name"
            />

            <InputWithLabel<TRegisterType>
              fieldTitle="Email"
              nameInSchema="email"
            />

            <InputWithLabel<TRegisterType>
              fieldTitle="Password"
              nameInSchema="password"
              type="password"
            />

            <InputWithLabel<TRegisterType>
              fieldTitle="Confirm Password"
              nameInSchema="confirmPassword"
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
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <ContinueWithGoogle />

        <p className="element-center gap-2">
          Already have an account?
          <Link
            href={Pages.LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUpForm;
