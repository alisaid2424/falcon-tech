"use client";

import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/server/actions/product";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  onSuccess?: () => void;
}
const DeleteProductButton = ({
  productId,
  onSuccess,
}: DeleteProductButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (confirm("Are you sure you want to delete this Product?")) {
        const res = await deleteProduct(productId);

        if (res.status && res.message) {
          if (res.status === 200) {
            toast({
              title: "Success! 🎉",
              description: res.message,
              className: "bg-green-600 text-white",
            });

            if (onSuccess) {
              onSuccess();
            }
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: res.message,
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unexpected response from server.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the product.",
      });
    }
  };

  return (
    <div
      onClick={handleDelete}
      className="bg-red-600 text-white p-2 hover:bg-red-800 transition-all duration-300 rounded-lg inline-block cursor-pointer"
    >
      <Trash2 size={20} />
    </div>
  );
};

export default DeleteProductButton;
