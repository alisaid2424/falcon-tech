"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import { Edit, List } from "lucide-react";
import { UserRole } from "@prisma/client";
import DeleteUserButton from "@/app/admin/users/DeleteUserButton";
import {
  CATEGORIES_PER_PAGE,
  ORDERS_PER_PAGE,
  PRODUCTS_PER_PAGE,
  USERS_PER_PAGE,
} from "@/constants/enums";
import Pagination from "./Pagination";
import LottieHandler from "@/lib/LottieHandler";
import DeleteCategoryButton from "@/app/admin/categories/_components/DeleteCategoryButton";
import DeleteProductButton from "@/app/admin/products/_components/DeleteProductButton";
import DeleteOrderButton from "@/app/admin/orders/_components/DeleteOrderButton";

interface AdminTableProps {
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  columns: Array<{ key: string; name: string }>;
  pageNumber: string;
  totalCount: number;
  type: "users" | "categories" | "products" | "orders";
}

const AdminTable: FC<AdminTableProps> = ({
  data,
  columns,
  pageNumber,
  totalCount,
  type,
}) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentPage = parseInt(pageNumber);

  const itemsPerPage =
    type === "users"
      ? USERS_PER_PAGE
      : type === "categories"
        ? CATEGORIES_PER_PAGE
        : type === "products"
          ? PRODUCTS_PER_PAGE
          : ORDERS_PER_PAGE;

  const pages =
    type === "users"
      ? Math.ceil(totalCount / USERS_PER_PAGE)
      : type === "categories"
        ? Math.ceil(totalCount / CATEGORIES_PER_PAGE)
        : type === "products"
          ? Math.ceil(totalCount / PRODUCTS_PER_PAGE)
          : Math.ceil(totalCount / ORDERS_PER_PAGE);

  const handleDeleteSuccess = () => {
    const isLastItemOnPage = data.length === 1;
    if (isLastItemOnPage && currentPage > 1) {
      router.push(`/admin/${type}?pageNumber=${currentPage - 1}`);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <main>
      <section className="section-gap lg:w-3/4 mx-auto">
        <div className="container">
          {type !== "orders" && (
            <div className="mb-10">
              <Link
                href={`/admin/${type}/add`}
                className="bg-gray-500 hover:bg-green-600 transition-colors py-2 px-3 rounded-md font-semibold text-lg 
                  text-white"
              >
                {type === "users"
                  ? "Create User"
                  : type === "categories"
                    ? "Create Category"
                    : type === "products"
                      ? "Create Product"
                      : null}
              </Link>
            </div>
          )}

          {data.length > 0 ? (
            <>
              <div className="overflow-x-auto mt-5">
                <table className="table text-center w-full min-w-[950px] text-foreground">
                  <thead className="border-t-2 border-b-2 border-border text-lg bg-muted">
                    <tr>
                      <th className="p-5">#</th>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className={`p-3 text-center align-middle capitalize ${
                            column.key === "createdAt" ||
                            column.key === "updatedAt"
                              ? "hidden lg:table-cell"
                              : column.key === "image"
                                ? "hidden sm:table-cell"
                                : ""
                          }`}
                        >
                          {column.name}
                        </th>
                      ))}
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-border odd:bg-card even:bg-muted hover:bg-accent/20 transition-colors"
                      >
                        <td className="p-3">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        {columns.map((column) => {
                          const value = item[column.key];

                          if (column.key === "image") {
                            return (
                              <td
                                key={column.key}
                                className="hidden sm:table-cell p-3 text-center align-middle"
                              >
                                {value ? (
                                  <Image
                                    src={value}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                    className="object-cover rounded-full mx-auto"
                                  />
                                ) : null}
                              </td>
                            );
                          }

                          if (
                            column.key === "createdAt" ||
                            column.key === "updatedAt"
                          ) {
                            return (
                              <td
                                key={column.key}
                                className="hidden lg:table-cell p-3 text-center align-middle"
                              >
                                {new Date(value).toDateString()}
                              </td>
                            );
                          }

                          return (
                            <td key={column.key} className="p-3">
                              {value}
                            </td>
                          );
                        })}

                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2 md:gap-3">
                            {type !== "orders" ? (
                              <Link
                                href={`/admin/${type}/${item.id}/edit`}
                                className="bg-primary text-primary-foreground rounded-lg p-2 hover:bg-accent-hover transition-all duration-300 inline-block"
                              >
                                <Edit size={20} color="white" />
                              </Link>
                            ) : (
                              <Link
                                href={`/admin/${type}/${item.id}`}
                                className="bg-teal-500 text-white rounded-lg p-2 hover:bg-primary transition-all duration-300 inline-block"
                              >
                                <List size={20} />
                              </Link>
                            )}

                            {type === "users" ? (
                              item.role !== UserRole.ADMIN && (
                                <DeleteUserButton
                                  userId={item.id}
                                  onSuccess={handleDeleteSuccess}
                                />
                              )
                            ) : type === "categories" ? (
                              <DeleteCategoryButton
                                categoryId={item.id}
                                onSuccess={handleDeleteSuccess}
                              />
                            ) : type === "products" ? (
                              <DeleteProductButton
                                productId={item.id}
                                onSuccess={handleDeleteSuccess}
                              />
                            ) : (
                              <DeleteOrderButton
                                orderId={item.id}
                                onSuccess={handleDeleteSuccess}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                pageNumber={parseInt(pageNumber)}
                pages={pages}
                route={`/admin/${type}`}
              />
            </>
          ) : (
            <div className="absolute inset-0 top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2 max-w-xs mt-12">
              <LottieHandler type="empty" message={`No ${type} found`} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminTable;
