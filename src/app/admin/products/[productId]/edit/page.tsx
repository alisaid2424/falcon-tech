import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/server/db/categories";
import { getProduct } from "@/server/db/products";
import { Pages } from "@/constants/enums";
import ProductForm from "../../_components/ProductForm";
import { ArrowLeftCircle } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { productId } = await params;
  const categories = await getCategories();
  const product = await getProduct(productId);

  if (!product) notFound();

  return (
    <main>
      <section className="section-gap lg:w-3/4 mx-auto">
        <div className="container">
          <Link
            href={`${Pages.PRODUCTS}?pageNumber=1`}
            className="flex items-center gap-2 mb-20 bg-red-500 text-white text-base rounded-full w-fit py-2 px-3"
          >
            <ArrowLeftCircle size={24} /> Back to MenuItems
          </Link>

          <ProductForm
            key={product.id}
            product={product}
            categories={categories}
          />
        </div>
      </section>
    </main>
  );
};

export default EditProductPage;
