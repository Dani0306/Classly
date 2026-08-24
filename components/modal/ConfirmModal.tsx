import React from "react";
import { useModal } from "@/providers/AppModalProvider";
import { TriangleAlert } from "lucide-react";
import LoadingScreen from "../loading/LoadingScreen";

const ConfirmModal = ({
  message,
  onConfirm,
  loading,
}: {
  message: string;
  onConfirm: () => void;
  loading?: boolean;
}) => {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex h-full flex-col items-center justify-center text-center space-y-6 px-6 py-8">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <TriangleAlert className="size-7 text-red-500" />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h3
          className="text-lg font-semibold text-foreground"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Are you sure?
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full pt-2">
        <button
          onClick={closeModal}
          className="flex-1 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 py-2.5 rounded-full bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
