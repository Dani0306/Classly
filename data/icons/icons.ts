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
} from "lucide-react";

export const classIcons = {
  bookOpen: BookOpen,
  flask: FlaskConical,
  sigma: Sigma,
  globe: Globe,
  palette: Palette,
  scrollText: ScrollText,
  microscope: Microscope,
  terminal: Terminal,
  brain: Brain,
  compass: Compass,
  stethoscope: Stethoscope,
  more: MoreHorizontal,
} as const;

export type ClassIconKey = keyof typeof classIcons;
