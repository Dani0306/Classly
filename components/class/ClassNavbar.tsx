"use client";

import PageButton from "../shared/PageButton";
import { Plus } from "lucide-react";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import CreateContentModal from "../contents/CreateContentModal";
import TypeFilters from "../shared/TypeFilters";

const ClassNavbar = ({ id }: { id: string }) => {
  const { openModal } = useModal();

  const handleOpenCreateContentModal = () => {
    openModal(
      <ModalContainer size="md">
        <CreateContentModal classId={id} />
      </ModalContainer>,
    );
  };

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <TypeFilters />

      <PageButton
        onClick={handleOpenCreateContentModal}
        text="New"
        icon={Plus}
      />
    </div>
  );
};

export default ClassNavbar;
