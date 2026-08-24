import { DiagramType } from "@/types";

const diagramTypeInstructions: Record<DiagramType, string> = {
  flowchart:
    "Create a flowchart using rectangular process boxes, diamond decision nodes, and directional arrows showing the flow between steps.",
  mindmap:
    "Create a mind map with a central topic node branching out into main categories, each with their own sub-branches and leaf nodes.",
  orgchart:
    "Create an organizational chart with a root node at the top and hierarchical levels branching downward showing relationships and structure.",
  venn: "Create a Venn diagram with overlapping circles showing shared and unique elements between the concepts.",
  timeline:
    "Create a horizontal or vertical timeline with sequential events or phases ordered chronologically from start to end.",
  comparison:
    "Create a side-by-side comparison diagram clearly contrasting two or more concepts, options, or items across multiple attributes.",
  cycle:
    "Create a circular cycle diagram showing a repeating process where the last step connects back to the first.",
  pyramid:
    "Create a pyramid diagram divided into horizontal layers representing hierarchy, importance, or progression from base to apex.",
};

export const generateDiagramPrompt = (
  title: string,
  content: string,
  diagramType: DiagramType = "flowchart",
  constraints?: string,
): string => {
  const typeInstruction = diagramTypeInstructions[diagramType];

  return `
You are an expert visual educator helping a student create a clear and accurate diagram for study purposes.

The student wants to create a ${diagramType} diagram based on the following topic:

Title: "${title}"

Content:
"""
${content}
"""

${constraints ? `Additional constraints from the student:\n"""\n${constraints}\n"""\n` : ""}

Your task is to generate a complete Mermaid.js diagram based on the content above.

Follow these rules strictly:
- ${typeInstruction}
- Base the diagram exclusively on the information provided in the content — do not add external knowledge
- Keep labels short and clear — maximum 6 words per node or label
- Use the same language the student used in their content
- The diagram must be accurate, readable, and useful as a study reference
- Do not include any explanations, titles, or descriptions outside the diagram code
- Ensure the Mermaid syntax is valid and will render without errors

Return ONLY the raw Mermaid.js diagram code. No preamble, no explanation, no markdown code fences, no extra text — just the pure Mermaid syntax starting with the diagram type declaration.
  `.trim();
};
