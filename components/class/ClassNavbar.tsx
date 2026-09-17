"use client";

import { useFilters } from "@/hooks/shared/useFilters";
import { contentTypes } from "@/data/colors/typeColors";
import PageButton from "../shared/PageButton";
import { Plus } from "lucide-react";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import CreateContentModal from "../contents/CreateContentModal";

const ClassNavbar = ({ id }: { id: string }) => {
  const { handleFilter, hasFilter, hasAnyFilter, clearFilter } = useFilters();
  const { openModal } = useModal();

  const handleOpenCreateNoteModal = () => {
    openModal(
      <ModalContainer size="md">
        <CreateContentModal classId={id} />
      </ModalContainer>,
    );
  };

  const allNotesSelected = !hasAnyFilter();

  return (
    <div className="flex space-y-6 flex-col xl:justify-between xl:items-center xl:flex-row">
      <div className="flex flex-wrap gap-3 items-center">
        {/* All Notes pill — uses primary green */}
        <button
          onClick={() => clearFilter({ type: "type" })}
          style={{
            backgroundColor: allNotesSelected ? "#35f527" : "#35f52730",
            borderColor: "#35f527",
            color: allNotesSelected ? "#ffffff" : "#35f527",
          }}
          className="px-4 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer"
        >
          All Contents
        </button>

        {/* Note type pills */}
        {contentTypes.map(({ type, label, color }) => {
          const isSelected = hasFilter({ type: "type", value: type });
          return (
            <button
              key={type}
              onClick={() => handleFilter({ type: "type", value: type })}
              style={{
                backgroundColor: isSelected ? color : `${color}30`,
                borderColor: color,
                color: isSelected ? "#ffffff" : color,
              }}
              className="px-4 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer"
            >
              {label}
            </button>
          );
        })}
      </div>

      <PageButton onClick={handleOpenCreateNoteModal} text="New" icon={Plus} />
    </div>
  );
};

export default ClassNavbar;
