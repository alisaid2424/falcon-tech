import { Routes } from "@/constants/enums";
import Link from "../link";
import Navbar from "./Navbar";
import AuthButtons from "./auth-buttons";
import CartButton from "./cart-button";
import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import WithoutNavAndFooter from "@/providers/WithoutNavAndFooter";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <WithoutNavAndFooter>
      <header className="bg-inherit shadow-sm py-2 sticky top-0 z-40 max-w-7xl mx-auto">
        <div className="container flex items-center justify-between h-16 gap-6 lg:gap-10">
          <Link href={Routes.ROOT}>
            <Image
              src="/logo.svg"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain dark:bg-white dark:rounded-full dark:p-1"
              priority
            />
          </Link>
          <Navbar session={session} />
          <div className="flex items-center gap-6 flex-1 justify-end">
            <div className="hidden lg:flex">
              <AuthButtons session={session} />
            </div>

            <ThemeToggle />

            <CartButton />
          </div>
        </div>
      </header>
    </WithoutNavAndFooter>
  );
};

export default Header;
