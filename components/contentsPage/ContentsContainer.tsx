"use client";

import PageContainer from "../shared/PageContainer";
import { Content } from "@/types";
import Input from "../shared/Input";
import ContentCard from "../contents/ContentCard";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { Plus, Search, SearchX, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "../shared/DatePicker";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/providers/AppModalProvider";
import { useToast } from "@/providers/ToastProvider";
import PageButton from "../shared/PageButton";
import ModalContainer from "../modal/ModalContainer";
import CreateContentModal from "../contents/CreateContentModal";
import { useFilters } from "@/hooks/shared/useFilters";
import EmptyState from "../shared/EmptyState";
import TypeFilters from "../shared/TypeFilters";

export const ContentsContainer = ({
  contents,
  classes,
}: {
  contents: Content[];
  classes: { id: string; name: string }[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openModal } = useModal();
  const { toast } = useToast();

  // Materials live inside a class, so the modal asks which one.
  const handleNew = () => {
    if (classes.length === 0) {
      toast({
        type: "error",
        title: "Create a class first",
        description: "Materials live inside a class.",
      });
      router.push("/app/classes");
      return;
    }

    openModal(
      <ModalContainer size="md">
        <CreateContentModal classes={classes} />
      </ModalContainer>,
    );
  };

  const { query, setQuery, value } = useDebounce(
    50,
    searchParams.get("search") ?? "",
  );
  const { handleFilter, clearAll, hasAnyFilter } = useFilters();

  const [dueDate, setDueDate] = useState(searchParams.get("dueDate") ?? "");

  useEffect(() => {
    handleFilter({ type: "search", value });
  }, [value, handleFilter]);

  useEffect(() => {
    handleFilter({ type: "dueDate", value: dueDate });
  }, [dueDate, handleFilter]);

  const hasActiveFilters = hasAnyFilter() || query !== "";

  const handleClearAll = () => {
    setQuery("");
    setDueDate("");
    clearAll();
  };

  return (
    <PageContainer
      title="All Materials"
      action={<PageButton onClick={handleNew} text="New material" icon={Plus} />}
      description="Browse, search and filter every note, task and study aid across your classes."
    >
      <div className="flex w-full flex-col gap-3 md:w-150 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            name="search"
            value={query}
            setValue={setQuery}
            placeholder="Search materials ..."
            icon={Search}
          />
        </div>
        <DatePicker
          name="dueDate"
          value={dueDate}
          setValue={setDueDate}
          placeholder="Filter by due date ..."
          className="md:w-56"
        />
      </div>
      <div className="flex flex-col space-y-3">
        <span className="font-semibold text-sm">Filter by</span>
        <div className="flex flex-wrap items-center gap-3">
          <TypeFilters />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-[3px] border border-border px-3.5 py-1 cursor-pointer transition-opacity hover:opacity-80"
            >
              <X className="size-3.5 shrink-0" />
              <span className="text-[12px] font-semibold whitespace-nowrap">
                Clear all
              </span>
            </button>
          )}
        </div>
      </div>
      {contents.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            compact
            icon={SearchX}
            title="Nothing matches these filters"
            description="No material matches your search or filters. Clear them to see everything you've created."
            action={
              <button
                type="button"
                onClick={handleClearAll}
                className="cursor-pointer text-xs font-medium text-foreground underline underline-offset-2"
              >
                Clear all filters
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Nothing here yet"
            description="Everything you add inside your classes, notes, tasks and the study aids made from notes, shows up here. Open a class and add your first one."
          />
        )
      ) : (
        <div className="wall flex gap-x-6 gap-y-8 pt-2 flex-wrap justify-center md:justify-start">
          {contents.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
