import { ContentType } from "@/types";

export const CONTENT_TYPE_COLORS: Record<
  ContentType,
  {
    bg: string;
    dark: string;
    border: string;
    text: string;
    icon: string;
    solid: string;
  }
> = {
  note: {
    bg: "bg-purple-100",
    dark: "bg-purple-600",
    border: "border-purple-300",
    text: "text-purple-700",
    icon: "text-purple-500",
    solid: "border-purple-900",
  },
  summarize: {
    bg: "bg-blue-200",
    dark: "bg-blue-600",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "text-blue-500",
    solid: "border-blue-500",
  },
  reminder: {
    bg: "bg-amber-50",
    dark: "bg-amber-600",
    border: "border-orange-200",
    text: "text-yellow-600",
    icon: "text-amber-500",
    solid: "border-amber-500",
  },
  homework: {
    bg: "bg-red-50",
    dark: "bg-red-600",
    border: "border-red-200",
    text: "text-red-700",
    icon: "text-red-500",
    solid: "border-red-500",
  },
  quiz: {
    bg: "bg-violet-100",
    dark: "bg-violet-600",
    border: "border-violet-200",
    text: "text-violet-700",
    icon: "text-violet-500",
    solid: "border-violet-500",
  },
  diagram: {
    bg: "bg-pink-100",
    dark: "bg-pink-600",
    border: "border-pink-200",
    text: "text-pink-700",
    icon: "text-pink-500",
    solid: "border-pink-500",
  },
  file: {
    bg: "bg-[#722F37]/10",
    dark: "bg-[#722F37]",
    border: "border-[#722F37]/30",
    text: "text-[#722F37]",
    icon: "text-[#722F37]",
    solid: "border-[#722F37]",
  },
  class: {
    bg: "bg-indigo-100",
    dark: "bg-indigo-600",
    border: "border-indigo-200",
    text: "text-indigo-700",
    icon: "text-indigo-500",
    solid: "border-indigo-500",
  },
};
