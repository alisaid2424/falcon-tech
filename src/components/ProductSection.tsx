import ProductList from "./ProductList";
import { getBestSellers } from "@/server/db/products";

const ProductSection = async () => {
  const bestSellers = await getBestSellers(8);

  return (
    <div className="container py-10">
      <div
        className="flex items-center justify-between mb-7 max-w-7xl mx-auto
      "
      >
        <h2 className="capitalize text-2xl font-extrabold ps-2">brand new</h2>
        <p className="capitalize text-base text-primary">
          view all collection &rarr;
        </p>
      </div>
      <ProductList products={bestSellers} />
    </div>
  );
};

export default ProductSection;
