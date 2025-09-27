"use client";

import { usePathname } from "next/navigation";

const WithoutNavAndFooter = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();

  // Only render children if not on signin or signup pages
  if (pathName.includes("signin") || pathName.includes("signup")) {
    return null;
  }

  return <>{children}</>;
};

export default WithoutNavAndFooter;
