import ProductList from "@/components/ProductList";
import LottieHandler from "@/lib/LottieHandler";
import { getProductsByCategory } from "@/server/db/products";

const CategoriesPage = async () => {
  const categorites = await getProductsByCategory();
  return (
    <main>
      {categorites.length ? (
        categorites.map((category) => (
          <section key={category.id} className="section-gap">
            <div className="container text-center">
              <h1 className="text-primary font-bold text-4xl capitalize italic mb-4">
                {category.name}
              </h1>
              <p className="text-gray-400 text-sm capitalize mb-14 max-w-md mx-auto leading-[1.6]">
                {category.description}
              </p>
              <ProductList products={category.products} />
            </div>
          </section>
        ))
      ) : (
        <div className="flex justify-center items-center text-center min-h-[calc(100vh-114px)]">
          <LottieHandler type="empty" message="No categories found" />
        </div>
      )}
    </main>
  );
};

export default CategoriesPage;
