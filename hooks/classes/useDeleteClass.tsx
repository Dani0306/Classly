import { deleteClass } from "@/actions/classes/deleteClass";
import ConfirmModal from "@/components/modal/ConfirmModal";
import ModalContainer from "@/components/modal/ModalContainer";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { Class } from "@/types";

export const useDeleteClass = (item: Class) => {
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    openModal(
      <ModalContainer size="xs">
        <ConfirmModal
          message={`Are you sure you want to delete ${item.name} class?`}
          onConfirm={async () => {
            try {
              await deleteClass(item.id);
              toast({
                title: "Class deleted successfully!",
                type: "success",
              });
              closeModal();
            } catch {
              toast({
                title: "Something went wrong",
                description: "Failed to delete class.",
                type: "error",
              });
            }
          }}
        />
      </ModalContainer>,
    );
  };

  return { handleDelete };
};
