import CartItems from "@/components/CartItems";

const CartPage = () => {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-foreground sm:text-3xl">
              Your Cart
            </h1>
          </header>

          <CartItems />
        </div>
      </div>
    </section>
  );
};

export default CartPage;
