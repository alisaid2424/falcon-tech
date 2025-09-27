"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { productIncloudeCategory } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addCartItem } from "@/store/cart/cartSlice";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const AddToCartButton = ({ product }: { product: productIncloudeCategory }) => {
  const dispatch = useAppDispatch();
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const { items, loading, error } = useAppSelector((state) => state.cart);

  const findItem = items.find((el) => el.product?.id === product.id);

  const handleAddToCart = async () => {
    if (!session.data?.user) {
      router.replace("/signin");
    } else {
      const resultAction = await dispatch(
        addCartItem({
          userId: session.data.user.id,
          productId: product.id,
          quantity: 1,
        })
      );

      if (addCartItem.rejected.match(resultAction)) {
        toast({
          variant: "destructive",
          title: "Failed to add",
          description:
            resultAction.error?.message ||
            "Failed to add product. Try again later.",
        });
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to add",
        description: error,
      });
    }
  }, [error, toast]);

  return (
    <div className="flex items-center justify-between flex-wrap gap-5 mt-4">
      {findItem ? (
        <UpdateItemQuantity
          cartId={findItem.id}
          currentQuantity={findItem.quantity}
          stock={findItem.product?.stock ?? 0}
        />
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={!product.instantDelivery || loading || product.stock === 0}
          variant="default"
          className="disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          <span>Add to Cart</span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
