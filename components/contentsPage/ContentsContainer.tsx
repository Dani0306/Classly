"use client";

import PageContainer from "../shared/PageContainer";
import { Content, CreatableContentType } from "@/types";
import Input from "../shared/Input";
import ContentCard from "../contents/ContentCard";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { Search, SearchX, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "../shared/DatePicker";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/hooks/shared/useFilters";
import ContentBadge from "../contents/ContentBadge";
import EmptyState from "../shared/EmptyState";
import { cn } from "@/lib/utils";

const FILTER_TYPES: CreatableContentType[] = [
  "homework",
  "reminder",
  "summarize",
  "note",
  "quiz",
  "diagram",
];

const ContentFilterButton = ({ type }: { type: CreatableContentType }) => {
  const { handleFilter, hasFilter, clearFilter } = useFilters();
  const selected = hasFilter({ type: "type", value: type });

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() =>
        selected
          ? clearFilter({ type: "type" })
          : handleFilter({ type: "type", value: type })
      }
      className={cn(
        "cursor-pointer transition-opacity",
        !selected && "opacity-60 hover:opacity-100",
      )}
    >
      <ContentBadge type={type} />
    </button>
  );
};

export const ContentsContainer = ({ contents }: { contents: Content[] }) => {
  const searchParams = useSearchParams();
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
      title="All Contents"
      description="Browse, search, and filter all the notes, summaries, quizzes, and diagrams you've created across your classes."
    >
      <div className="flex w-full flex-col gap-3 md:w-150 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            name="search"
            value={query}
            setValue={setQuery}
            placeholder="Search Content ..."
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
        <div className="flex flex-wrap gap-3">
          {FILTER_TYPES.map((type) => (
            <ContentFilterButton key={type} type={type} />
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-400 px-3.5 py-1 cursor-pointer transition-opacity hover:opacity-80"
            >
              <X className="size-3.5 shrink-0 text-black" />
              <span className="text-[12px] font-semibold whitespace-nowrap text-black">
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
            description="No content matches your search or filters. Clear them to see everything you've created."
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
            description="Everything you create inside your classes — notes, summaries, quizzes and diagrams — shows up here. Open a class and add your first one."
          />
        )
      ) : (
        <div className="flex gap-4 flex-wrap justify-center md:justify-start">
          {contents.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
