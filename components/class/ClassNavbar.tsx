"use client";

import { useFilters } from "@/hooks/shared/useFilters";
import { contentTypes } from "@/data/colors/typeColors";
import PageButton from "../shared/PageButton";
import { Plus } from "lucide-react";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import CreateContentModal from "../contents/CreateContentModal";
import { Plan } from "@/types";

const ClassNavbar = ({ id, plan }: { id: string; plan: Plan }) => {
  const { handleFilter, hasFilter, hasAnyFilter, clearFilter } = useFilters();
  const { openModal } = useModal();

  const handleOpenCreateContentModal = () => {
    openModal(
      <ModalContainer size="md">
        <CreateContentModal plan={plan} classId={id} />
      </ModalContainer>,
    );
  };

  const allNotesSelected = !hasAnyFilter();

  return (
    <div className="flex space-y-6 flex-col xl:justify-between xl:items-center xl:flex-row">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={() => clearFilter({ type: "type" })}
          aria-pressed={allNotesSelected}
          className={`press px-4 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${
            allNotesSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface text-foreground hover:bg-surface-muted"
          }`}
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
              aria-pressed={isSelected}
              style={
                isSelected
                  ? { backgroundColor: color, borderColor: color }
                  : undefined
              }
              className={`press flex items-center gap-2 px-3.5 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${
                isSelected
                  ? "text-white"
                  : "border-border bg-surface text-foreground hover:bg-surface-muted"
              }`}
            >
              {!isSelected && (
                <span
                  aria-hidden
                  style={{ backgroundColor: color }}
                  className="size-2 rounded-full"
                />
              )}
              {label}
            </button>
          );
        })}
      </div>

      <PageButton
        onClick={handleOpenCreateContentModal}
        text="New"
        icon={Plus}
      />
    </div>
  );
};

export default ClassNavbar;
