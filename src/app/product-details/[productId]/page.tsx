import BreadCrumb from "@/components/BreadCrumb";
import Image from "next/image";
import { BadgeCheck, AlertOctagon } from "lucide-react";
import ProductList from "@/components/ProductList";
import { notFound } from "next/navigation";
import { getProduct, getProductsByCategoryId } from "@/server/db/products";
import AddToCartButton from "@/components/AddToCartButton";
import { formatCurrency } from "@/lib/formatters";

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const ProductDetailsPage = async ({ params }: PageProps) => {
  const { productId } = await params;

  const product = await getProduct(productId);

  if (!product) {
    return notFound();
  }

  const ProductsByCategory = (
    await getProductsByCategoryId(product.categoryId)
  ).filter((p) => p.id !== product?.id);

  return (
    <div className="py-8 container max-w-7xl mx-auto">
      <BreadCrumb />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-0 ">
        <Image
          src={product.image}
          alt="banner-product-details"
          width={400}
          height={400}
          className="rounded-lg object-cover h-[300px] w-[400px] "
        />
        <div className="product-info">
          <h2 className="text-xl">{product.name}</h2>
          <h3 className="text-base text-gray-400 mt-2 uppercase">
            {product.category.name}
          </h3>
          <p className="text-sm mt-3 leading-[1.8]">{product.description}</p>
          <p className="text-xs italic my-3 text-gray-400 leading-[1.5]">
            {product.category.description}
          </p>
          <p className="text-gray-600 flex items-center gap-2 text-xs font-medium">
            {product.instantDelivery ? (
              <BadgeCheck size={24} color="green" />
            ) : (
              <AlertOctagon size={24} color="red" />
            )}
            {product.instantDelivery
              ? "Eligible For Instant Delivery"
              : "Not eligible for delivery"}
          </p>
          <h4 className="text-[32px] text-foreground mt-3">
            {formatCurrency(product.price)}
          </h4>

          <AddToCartButton product={product} />
        </div>
      </div>

      <div>
        <h2 className="mt-24 mb-8 capitalize text-xl font-extrabold">
          similar products
        </h2>

        <ProductList products={ProductsByCategory} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
