"use client";

import { Pages, Routes } from "@/constants/enums";
import Link from "../link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import AuthButtons from "./auth-buttons";
import { Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { fetchUserCart } from "@/store/cart/cartSlice";
import { useAppDispatch } from "@/store/hook";

interface NavBarProps {
  session: Session | null;
}

function Navbar({ session }: NavBarProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  const links = [
    {
      id: crypto.randomUUID(),
      title: "Home",
      href: Routes.ROOT,
    },
    {
      id: crypto.randomUUID(),
      title: "Categories",
      href: Pages.CATEGORIES,
    },
    {
      id: crypto.randomUUID(),
      title: "About",
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: "Contact",
      href: Routes.CONTACT,
    },
  ];

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname === href;
  };

  const isAdmin = session?.user.role === UserRole.ADMIN;

  useEffect(() => {
    if (session?.user.id) {
      dispatch(fetchUserCart(session?.user.id));
    }
  }, [session?.user.id, dispatch]);

  return (
    <nav className="order-last lg:order-none">
      <Button
        variant="secondary"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpenMenu(true)}
      >
        <Menu className="!w-6 !h-6" />
      </Button>
      <ul
        className={`fixed lg:static ${
          openMenu ? "top-0 z-50" : "-top-full"
        } left-0 px-10 py-20 lg:p-0 bg-slate-200 dark:bg-background  lg:bg-transparent transition-all duration-300 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-5 lg:gap-10 border-b-[2px] border-accent lg:border-b-0 lg:transition-none `}
      >
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-10 right-10 lg:hidden"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="!w-6 !h-6" />
        </Button>
        {links.map((link) => (
          <li
            key={link.id}
            className="border-b-2 border-accent/30 pb-5 lg:pb-0 lg:border-b-0 w-full"
          >
            <Link
              onClick={() => setOpenMenu(false)}
              href={link.href}
              className={`hover:text-primary font-semibold hover:ps-2 lg:hover:ps-0 transition-all duration-300 ${
                isActive(link.href) ? "text-primary" : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}
        {session?.user && (
          <li>
            <Link
              href={isAdmin ? Routes.ADMIN : Routes.PROFILE}
              onClick={() => setOpenMenu(false)}
              className={`${
                pathname.startsWith(isAdmin ? Routes.ADMIN : Routes.PROFILE)
                  ? "text-primary"
                  : "text-accent"
              } hover:text-primary duration-200 transition-colors font-semibold`}
            >
              {isAdmin ? "Admin" : "Profile"}
            </Link>
          </li>
        )}
        <li className="lg:hidden flex flex-col gap-4">
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons session={session} />
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
