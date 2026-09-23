import { Plan } from "@/types";
import { GraduationCap, Rocket, LucideIcon } from "lucide-react";

type PlanOption = {
  plan: Plan;
  label: string;
  price: string;
  billing: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

export const PLANS: PlanOption[] = [
  {
    plan: "starter",
    label: "Starter",
    price: "Free",
    billing: "forever",
    description: "Everything you need to organize your first classes.",
    icon: GraduationCap,
    features: ["Basic AI OCR", "5 smart summaries / mo", "Standard support"],
  },
  {
    plan: "pro",
    label: "Pro",
    price: "$12",
    billing: "per month",
    description: "Unlimited AI for the serious academic.",
    icon: Rocket,
    features: [
      "Unlimited AI OCR",
      "Unlimited smart summaries",
      "Quiz & diagram generator",
      "Priority 24/7 support",
    ],
  },
];
