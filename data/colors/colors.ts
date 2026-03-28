export const colors = {
  green: "#22c55e",
  softGreen: "#86efac",
  softRed: "#fca5a5",
  softBlue: "#bfdbfe",
  softPurple: "#d8b4fe",
  softYellow: "#fde68a",
  softPink: "#fbcfe8",
} as const;

export type ClassColorKey = keyof typeof colors;
