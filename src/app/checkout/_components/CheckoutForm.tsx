import { DOMAIN } from "@/constants/enums";
import { useToast } from "@/hooks/use-toast";
import { createNewOrder } from "@/server/actions/order";
import { removeCartItem, selectCartItems } from "@/store/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Order } from "@prisma/client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm = ({ amount }: CheckoutFormProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const cart = useAppSelector(selectCartItems);
  const session = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      setLoading(true);

      // Validate form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError.message);
        return;
      }

      // Create payment intent
      const res = await fetch(`${DOMAIN}/api/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const responseData = await res.json();

      let orderRes: Order | null = null;

      if (!res.ok || !responseData.clientSecret) {
        console.error("Failed to create payment intent:", responseData.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Payment creation failed. Try again later.",
        });

        return;
      } else {
        // create order
        orderRes = (await createOrder()) as Order;

        if (!orderRes) return;

        //send email
        await sendEmail(orderRes);
        toast({
          title: "Success! 🎉",
          description: "Payment successful and order created and send email",
          className: "bg-green-600 text-white",
        });
      }

      const clientSecret = responseData.clientSecret;

      // Confirm payment
      const result = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: `${DOMAIN}/payment-confirm?orderId=${orderRes.id}`,
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error.message,
        });

        return;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    if (!session.data?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User Not Found",
      });

      return;
    }
    if (!session.data.user.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User name is required",
      });
      return;
    }

    const productItems = cart
      ?.filter((item) => item.product?.id)
      .map((item) => ({
        productId: item.product!.id,
        quantity: item.quantity ?? 1,
        userId: session.data?.user.id,
      }));

    const orderData = {
      userName: session.data.user.name,
      email: session.data.user.email,
      phone: session.data.user.phone ?? "",
      streetAddress: session.data.user.streetAddress ?? "",
      postalCode: session.data.user.postalCode ?? "",
      city: session.data.user.city ?? "",
      country: session.data.user.country ?? "",
      amount,
      productItems,
    };

    try {
      const result = await createNewOrder(orderData);
      if (result.status === 201) {
        await Promise.all(
          cart
            .map((item) => {
              if (item?.id) {
                return dispatch(removeCartItem(item.id));
              }
            })
            .filter(Boolean)
        );

        toast({
          title: "Success! 🎉",
          description: result.message,
          className: "bg-green-600 text-white",
        });

        return result.order;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Order failed");
    }
  };

  const sendEmail = async (order: Order) => {
    if (!session.data?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User Not Found",
      });
      return;
    }

    await fetch(`${DOMAIN}/api/send-email`, {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        email: session.data.user.email,
        fullName: session.data.user.name,
        orderId: order.id,
      }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container w-full md:w-2/3 lg:w-2/4 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] my-10"
    >
      <div className="w-full">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-5 bg-primary text-white rounded-md py-3 text-lg hover:bg-teal-500 transition-colors"
      >
        {loading ? <LoaderCircle className="animate-spin mx-auto" /> : "Submit"}
      </button>
    </form>
  );
};

export default CheckoutForm;
