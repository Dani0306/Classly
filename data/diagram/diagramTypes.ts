import { DiagramType } from "@/types";

type DiagramTypeOption = {
  type: DiagramType;
  label: string;
};

export const diagramTypes: DiagramTypeOption[] = [
  { type: "flowchart", label: "Flowchart" },
  { type: "mindmap", label: "Mind Map" },
  { type: "orgchart", label: "Org Chart" },
  { type: "venn", label: "Venn Diagram" },
  { type: "timeline", label: "Timeline" },
  { type: "comparison", label: "Comparison" },
  { type: "cycle", label: "Cycle" },
  { type: "pyramid", label: "Pyramid" },
];
