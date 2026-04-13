"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmDelete } from "@/lib/swal";
import { deleteOrder } from "@/server/actions/order";
import { Trash2 } from "lucide-react";

interface DeleteOrderButtonProps {
  orderId: string;
  onSuccess?: () => void;
}

const DeleteOrderButton = ({ orderId, onSuccess }: DeleteOrderButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const confirmed = await confirmDelete(
        "Delete Order?",
        "Are you sure you want to delete this order?",
      );

      if (!confirmed) return;

      const res = await deleteOrder(orderId);

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

export default DeleteOrderButton;
