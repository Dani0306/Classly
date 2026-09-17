import { DiagramType } from "@/types";

const diagramTypeInstructions: Record<DiagramType, string> = {
  flowchart:
    "A flowchart read from top to bottom. Each step is a rounded rectangle, each decision is a diamond with its outgoing arrows labeled (for example Yes / No). Arrows show the direction of the flow from the first step to the last.",
  mindmap:
    "A mind map with the main topic in a central node. 3 to 6 main branches radiate outward from it, each with up to 3 short sub-points. Give each main branch its own color, shared by its sub-points.",
  orgchart:
    "A hierarchy chart with the top-level item at the top and each level below it aligned on its own row. Straight connector lines link each item to the item directly above it.",
  venn: "A Venn diagram with 2 or 3 overlapping circles, each labeled with the concept it represents. Items unique to one concept go in that circle's non-overlapping area; items shared by concepts go in the overlapping area.",
  timeline:
    "A horizontal timeline read from left to right, with evenly spaced markers in chronological order. Each marker has a date or phase label and a short description of the event.",
  comparison:
    "A side-by-side comparison laid out like a table: one column per item being compared, a header naming each item, and one row per attribute, so values can be read across.",
  cycle:
    "A cycle diagram with the steps placed evenly around a circle, numbered in order, connected by arrows going clockwise, with an arrow from the last step back to the first.",
  pyramid:
    "A pyramid divided into horizontal layers that get narrower toward the top. The base is the broadest or most fundamental level and the apex is the highest or most specific. Each layer is labeled inside it.",
};

export const generateDiagramPrompt = (
  title: string,
  content: string,
  diagramType: DiagramType = "flowchart",
  constraints?: string,
): string => {
  const typeInstruction = diagramTypeInstructions[diagramType];

  return `
Use the image generation tool to create a study diagram image. Do not answer with text, code, or a description instead of the image.

The student wants a ${diagramType} diagram about "${title}", based only on this content:

"""
${content}
"""
${
  constraints
    ? `
The student added these instructions for the diagram:

"""
${constraints}
"""
`
    : ""
}
DIAGRAM TYPE
${typeInstruction}
- Always draw this type of diagram, even if the content would suit another type better. Fit the content's information into this structure.

CONTENT
- Use only information from the content above. Do not add facts, steps, examples, or labels from outside knowledge.
- Pick the key ideas that matter for studying; leave out minor details. Use at most 12 labeled elements so the diagram stays readable.
- Every relationship shown (an arrow, an overlap, a level, an order) must match what the content says.

TEXT IN THE IMAGE
- Write all text in the same language as the content.
- Keep every label short: at most 5 words. No full sentences or paragraphs.
- Spell every word correctly and exactly as it appears in the content, including names, terms, and numbers.
- Do not add a title, heading, caption, legend, watermark, or any other text beyond the diagram's labels.

VISUAL STYLE
- Clean, flat, minimal vector style, like a diagram in a textbook. Not photorealistic, not 3D, not hand-drawn.
- Plain white background.
- Dark, high-contrast, large text that is easy to read.
- A small palette of soft, distinct colors used consistently; the same kind of element always gets the same color.
- Even spacing, aligned elements, and no overlapping text or crossing lines.
- No people, characters, decorative illustrations, icons, or background patterns.

STUDENT INSTRUCTIONS
If the student added instructions, follow them. They take priority over the CONTENT and VISUAL STYLE rules above, but they never change the diagram type, never allow outside information, and never allow long text in the image.
  `.trim();
};
