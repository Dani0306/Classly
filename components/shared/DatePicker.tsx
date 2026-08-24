"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker = ({
  value,
  setValue,
  label,
  placeholder = "Select a date ...",
  name,
  className,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  placeholder?: string;
  name?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleSelectDay = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setValue(date.toISOString().split("T")[0]);
    setOpen(false);
  };

  const handlePrevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const formatDisplay = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      day === selected.getDate() &&
      viewDate.getMonth() === selected.getMonth() &&
      viewDate.getFullYear() === selected.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(
    viewDate.getFullYear(),
    viewDate.getMonth(),
  );
  const firstDay = getFirstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth(),
  );

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-foreground/70 tracking-wide"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center gap-2 px-4 py-2.5 rounded-full text-sm outline-none transition-all duration-200 text-left",
          "bg-zinc-100 border border-zinc-200",
          "focus:border-primary/60 focus:ring-2 focus:ring-primary/10",
          value ? "text-foreground" : "text-muted-foreground/50",
        )}
      >
        <Calendar className="size-4 text-muted-foreground/60 shrink-0" />
        <span className="flex-1">
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-border rounded-2xl shadow-lg p-4 w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-medium text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "h-8 w-8 mx-auto rounded-full text-xs font-medium transition-all duration-150 cursor-pointer",
                    isSelected(day)
                      ? "bg-primary text-white"
                      : isToday(day)
                        ? "border border-primary text-primary"
                        : "hover:bg-gray-100 text-foreground",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setValue("");
                setOpen(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setValue(today.toISOString().split("T")[0]);
                setViewDate(today);
                setOpen(false);
              }}
              className="text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
