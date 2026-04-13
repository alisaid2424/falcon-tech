"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmDelete } from "@/lib/swal";
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
      const confirmed = await confirmDelete(
        "Delete Product?",
        "Are you sure you want to delete this product?",
      );

      if (!confirmed) return;

      const res = await deleteProduct(productId);

      if (res.success) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-600 text-white",
        });

        onSuccess?.();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <Button onClick={handleDelete} variant="destructive" size="icon">
      <Trash2 size={20} />
    </Button>
  );
};

export default DeleteProductButton;
