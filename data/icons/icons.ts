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
};

export const classIcons: ClassIcon[] = [
  { name: "bookOpen", icon: BookOpen },
  { name: "flask", icon: FlaskConical },
  { name: "sigma", icon: Sigma },
  { name: "globe", icon: Globe },
  { name: "palette", icon: Palette },
  { name: "scrollText", icon: ScrollText },
  { name: "microscope", icon: Microscope },
  { name: "terminal", icon: Terminal },
  { name: "brain", icon: Brain },
  { name: "compass", icon: Compass },
  { name: "stethoscope", icon: Stethoscope },
  { name: "more", icon: MoreHorizontal },
];
