export const MAX_PIN_TITLE = 200;

/**
 * Turns what a student types or pastes into a link we can store, or null.
 * "course.edu/syllabus" becomes "https://course.edu/syllabus".
 */
export const normalizeLink = (input: string) => {
  const raw = input.trim();
  if (!raw) return null;

  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost")
      return null;
    return url.toString();
  } catch {
    return null;
  }
};

/** "www.khanacademy.org" → "khanacademy.org". */
export const linkHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** A file's name without its extension, for a pin's default title. */
export const fileTitle = (name: string) =>
  (name.replace(/\.[^.]+$/, "").trim() || name).slice(0, MAX_PIN_TITLE);
