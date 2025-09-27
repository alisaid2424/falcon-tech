import LottieHandler from "@/lib/LottieHandler";
import ProductItem from "./ProductItem";
import { productIncloudeCategory } from "@/types/product";

type Props = {
  products: productIncloudeCategory[];
};

const ProductList = ({ products }: Props) => {
  return products.length ? (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4 max-w-7xl mx-auto">
      {products.map((item, index) => (
        <ProductItem product={item} key={item.id} index={index} />
      ))}
    </div>
  ) : (
    <div className="w-full max-w-xs mx-auto">
      <LottieHandler type="empty" message="Products list is empty" />
    </div>
  );
};

export default ProductList;
