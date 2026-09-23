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
import { AppUser, Class, Content, DropDownMenuOptions } from "@/types";
import ClassNavbar from "./ClassNavbar";
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
  user,
}: {
  classItem: Class;
  contents: Content[];
  user: AppUser;
}) => {
  const { openModal } = useModal();
  const { hasAnyFilter } = useFilters();

  const plan = user.plan ?? "starter";

  const handleOpenCreateContentModal = () => {
    openModal(
      <ModalContainer size="md">
        <CreateContentModal plan={plan} classId={classItem.id} />
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
      <ClassNavbar plan={plan} id={classItem.id} />

      {contents.length === 0 ? (
        hasAnyFilter() ? (
          <EmptyState
            compact
            icon={SearchX}
            title="Nothing of this type yet"
            description="This class has no content of the type you picked. Choose another type, or select All Contents."
          />
        ) : (
          <EmptyState
            icon={NotebookPen}
            title={`${classItem.name} is empty`}
            description="Add a note, summary, quiz, diagram, homework or reminder, and AI will turn what you write into study material."
            action={
              <PageButton
                onClick={handleOpenCreateContentModal}
                text="Add your first content"
                icon={Plus}
                size="md"
              />
            }
          />
        )
      ) : (
        <div className="flex flex-wrap justify-center md:justify-start gap-5">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default ClassContent;
