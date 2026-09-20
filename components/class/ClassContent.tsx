"use client";

import { Eye, Pencil, Trash2, Share2, BookOpen, Edit } from "lucide-react";
import PageContainer from "../shared/PageContainer";
import { Class, Content, DropDownMenuOptions } from "@/types";
import ClassNavbar from "./ClassNavbar";
import ContentCard from "../contents/ContentCard";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import CreateClassModal from "../classes/CreateClassModal";
import DropDownMenu from "../shared/DropDownMenu";

const ClassContent = ({
  classItem,
  contents,
}: {
  classItem: Class;
  contents: Content[];
}) => {
  const { openModal } = useModal();

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
      <ClassNavbar id={classItem.id} />

      <div className="flex flex-wrap justify-center gap-5">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </PageContainer>
  );
};

export default ClassContent;
