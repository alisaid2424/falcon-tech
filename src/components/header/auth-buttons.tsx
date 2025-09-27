"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Pages } from "@/constants/enums";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

function AuthButtons({ session }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      {!session?.user ? (
        <div className="flex items-center gap-6">
          <Button
            className={`${
              pathname.startsWith(Pages.LOGIN) ? "text-primary" : "text-accent"
            } hover:text-primary duration-200 transition-colors capitalize font-semibold text-base hover:no-underline !px-0`}
            size="lg"
            variant="link"
            onClick={() => router.push(Pages.LOGIN)}
          >
            Login
          </Button>
          <Button
            className="!px-8 !rounded-full text-base capitalize hover:bg-teal-500"
            size="lg"
            onClick={() => router.push(Pages.Register)}
          >
            register
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-10">
          <Button
            className="!px-8 !rounded-full"
            size="lg"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}

export default AuthButtons;
