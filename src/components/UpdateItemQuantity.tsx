"use client";

import { useAppDispatch } from "@/store/hook";
import { updateCartItem } from "@/store/cart/cartSlice";

type Props = {
  cartId: string;
  currentQuantity: number;
  stock: number;
};

const UpdateItemQuantity = ({ cartId, currentQuantity, stock }: Props) => {
  const dispatch = useAppDispatch();

  const handleIncrease = () => {
    if (currentQuantity < stock) {
      dispatch(updateCartItem({ cartId, quantity: currentQuantity + 1 }));
    }
  };

  const handleDecrease = () => {
    dispatch(updateCartItem({ cartId, quantity: currentQuantity - 1 }));
  };

  return (
    <div className="flex items-center justify-center gap-3 md:gap-5">
      <button
        className="btnDecrease"
        onClick={handleDecrease}
        disabled={currentQuantity <= 0}
      >
        -
      </button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <button
        className="btnIncrease"
        onClick={handleIncrease}
        disabled={currentQuantity >= stock}
      >
        +
      </button>
    </div>
  );
};

export default UpdateItemQuantity;
