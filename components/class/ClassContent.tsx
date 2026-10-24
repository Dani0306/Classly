"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Share2,
  BookOpen,
  Edit,
  Plus,
  SearchX,
  NotebookPen,
} from "lucide-react";
import PageContainer from "../shared/PageContainer";
import { Class, ClassPin, Content, DropDownMenuOptions } from "@/types";
import ClassNavbar from "./ClassNavbar";
import ClassPins from "./ClassPins";
import ContentCard from "../contents/ContentCard";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import CreateClassModal from "../classes/CreateClassModal";
import DropDownMenu from "../shared/DropDownMenu";
import CreateContentModal from "../contents/CreateContentModal";
import EmptyState from "../shared/EmptyState";
import PageButton from "../shared/PageButton";
import { useFilters } from "@/hooks/shared/useFilters";

const ClassContent = ({
  classItem,
  contents,
  pins,
}: {
  classItem: Class;
  contents: Content[];
  pins: ClassPin[];
}) => {
  const { openModal } = useModal();
  const { hasAnyFilter } = useFilters();

  const handleOpenCreateContentModal = () => {
    openModal(
      <ModalContainer size="md">
        <CreateContentModal classId={classItem.id} />
      </ModalContainer>,
    );
  };

  const dropdownOptions: DropDownMenuOptions = [
    {
      label: "View Details",
      fn: () => {},
      icon: Eye,
    },
    {
      label: "Edit Class",
      fn: () => {},
      icon: Pencil,
    },
    {
      label: "View Notes",
      fn: () => {},
      icon: BookOpen,
    },
    {
      label: "Share Class",
      fn: () => {},
      icon: Share2,
    },
    {
      label: "Delete",
      fn: () => {},
      icon: Trash2,
    },
  ];

  const handleModifyClass = () => {
    openModal(
      <ModalContainer size="lg">
        <CreateClassModal classContent={classItem} />
      </ModalContainer>,
    );
  };

  return (
    <PageContainer
      title={classItem.name}
      description={classItem.description}
      action={
        <div className="flex space-x-3 items-center">
          <Edit
            onClick={handleModifyClass}
            className="cursor-pointer hover:bg-foreground/20 transition-all duration-50 text-foreground/80 size-11 p-3 bg-foreground/10 rounded-xl"
          />

          <DropDownMenu options={dropdownOptions} />
        </div>
      }
    >
      <ClassPins
        pins={pins}
        classId={classItem.id}
        className={classItem.name}
      />

      <section
        aria-labelledby="materials-heading"
        className="flex flex-col gap-6"
      >
        <h2
          id="materials-heading"
          className="border-t border-border pt-8 text-lg font-bold tracking-tight"
        >
          Materials
        </h2>

        <ClassNavbar id={classItem.id} />

        {contents.length === 0 ? (
          hasAnyFilter() ? (
            <EmptyState
              compact
              icon={SearchX}
              title="Nothing of this type yet"
              description="This class has nothing of the type you picked. Choose another filter, or select All."
            />
          ) : (
            <EmptyState
              icon={NotebookPen}
              title={`${classItem.name} is empty`}
              description="Add a note or a task. Open a note later to turn it into a summary, quiz or diagram."
              action={
                <PageButton
                  onClick={handleOpenCreateContentModal}
                  text="Add your first material"
                  icon={Plus}
                  size="md"
                />
              }
            />
          )
        ) : (
          <div className="wall flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-8 pt-2">
            {contents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                classLabel={classItem.name}
              />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
};

export default ClassContent;
