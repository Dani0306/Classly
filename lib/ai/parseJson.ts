/** Parses a model's JSON reply, tolerating a markdown code fence around it. */
export const parseModelJson = <T = unknown>(raw: string): T => {
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(text) as T;
};
