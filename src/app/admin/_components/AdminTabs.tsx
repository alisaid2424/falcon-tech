"use client";

import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminTabs = () => {
  const pathname = usePathname();

  const tabs = [
    {
      id: crypto.randomUUID(),
      title: "Profile",
      href: Routes.ADMIN,
    },
    {
      id: crypto.randomUUID(),
      title: "Categories",
      href: Routes.CATEGORIES,
    },
    {
      id: crypto.randomUUID(),
      title: "Products",
      href: Pages.PRODUCTS,
    },
    {
      id: crypto.randomUUID(),
      title: "Users",
      href: Pages.USERS,
    },
    {
      id: crypto.randomUUID(),
      title: "Orders",
      href: Pages.ORDERS,
    },
  ];

  const isActiveTab = (href: string) => {
    const hrefArray = href.split("/");
    return hrefArray.length > 2 ? pathname.startsWith(href) : pathname === href;
  };

  return (
    <nav className="mt-10">
      <ul className="flex items-center flex-wrap gap-5 justify-center">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <Link
              href={`${tab.href}?pageNumber=1`}
              className={
                isActiveTab(tab.href)
                  ? buttonVariants({ variant: "default" })
                  : buttonVariants({ variant: "outline" })
              }
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminTabs;
