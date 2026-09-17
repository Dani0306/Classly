"use client";
import { useDebounce } from "@/hooks/shared/useDebounce";
import Input from "../shared/Input";
import { Plus, Search } from "lucide-react";
import PageContainer from "../shared/PageContainer";
import PageButton from "../shared/PageButton";
import { useModal } from "@/providers/AppModalProvider";
import ModalContainer from "../modal/ModalContainer";
import CreateClassModal from "./CreateClassModal";
import { Class } from "@/types";
import ClassCard from "./ClassCard";
import { useFilters } from "@/hooks/shared/useFilters";
import { useEffect } from "react";

const MyClassesContent = ({ classes }: { classes: Class[] }) => {
  const { query, value, setQuery } = useDebounce(50);

  const { handleFilter } = useFilters();

  useEffect(() => {
    handleFilter({ type: "search", value });
  }, [value, handleFilter]);

  const { openModal } = useModal();

  const handleOpenNewClassModal = () => {
    openModal(
      <ModalContainer size="lg">
        <CreateClassModal />
      </ModalContainer>,
    );
  };

  return (
    <PageContainer
      title="My Classes"
      description="Create and manage your classes to organize your notes, homework and reminders."
      action={
        <PageButton
          onClick={handleOpenNewClassModal}
          text="New Class"
          icon={Plus}
          size="md"
        />
      }
    >
      <div className="w-full md:w-150">
        <Input
          name="search"
          value={query}
          setValue={setQuery}
          placeholder="Search Class ..."
          icon={Search}
        />
      </div>
      <div className="flex gap-8 flex-wrap justify-center md:justify-start">
        {classes.map((item) => (
          <ClassCard key={item.id} item={item} />
        ))}
      </div>
    </PageContainer>
  );
};

export default MyClassesContent;
