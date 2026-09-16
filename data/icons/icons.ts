import {
  BookOpen,
  FlaskConical,
  Sigma,
  Globe,
  Palette,
  ScrollText,
  Microscope,
  Terminal,
  Brain,
  Compass,
  Stethoscope,
  MoreHorizontal,
  LucideIcon,
} from "lucide-react";

export type ClassIcon = {
  name: string;
  icon: LucideIcon;
  color: string;
};

export const classIcons: ClassIcon[] = [
  { name: "bookOpen", icon: BookOpen, color: "#FBBF24" }, // soft amber — literature/reading
  { name: "flask", icon: FlaskConical, color: "#6EE7B7" }, // soft emerald — chemistry
  { name: "sigma", icon: Sigma, color: "#93C5FD" }, // soft blue — math
  { name: "globe", icon: Globe, color: "#5EEAD4" }, // soft teal — geography/languages
  { name: "palette", icon: Palette, color: "#F9A8D4" }, // soft pink — art
  { name: "scrollText", icon: ScrollText, color: "#D6B594" }, // soft sepia — history
  { name: "microscope", icon: Microscope, color: "#86EFAC" }, // soft green — biology
  { name: "terminal", icon: Terminal, color: "#A5B4FC" }, // soft indigo — computer science
  { name: "brain", icon: Brain, color: "#C4B5FD" }, // soft violet — psychology
  { name: "compass", icon: Compass, color: "#FDBA74" }, // soft orange — social studies
  { name: "stethoscope", icon: Stethoscope, color: "#FCA5A5" }, // soft red — medicine/health
  { name: "more", icon: MoreHorizontal, color: "#CBD5E1" }, // soft slate — other
];
