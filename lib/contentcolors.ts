import { ContentType } from "@/types";

export const CONTENT_TYPE_COLORS: Record<
  ContentType,
  { bg: string; border: string; text: string; icon: string; solid: string }
> = {
  note: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    icon: "text-purple-500",
    solid: "border-purple-500",
  },
  summarize: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "text-blue-500",
    solid: "border-blue-500",
  },
  reminder: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "text-amber-500",
    solid: "border-amber-500",
  },
  homework: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "text-red-500",
    solid: "border-red-500",
  },
  quiz: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    icon: "text-violet-500",
    solid: "border-violet-500",
  },
  diagram: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    icon: "text-pink-500",
    solid: "border-pink-500",
  },
  class: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    icon: "text-indigo-500",
    solid: "border-indigo-500",
  },
};
