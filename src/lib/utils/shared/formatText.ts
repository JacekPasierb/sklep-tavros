export const normalizeMultiline = (input?: string | null) => {
  return (input ?? "").trim().replace(/\\n/g, "\n");
};

export const splitParagraphs = (text?: string | null) => {
  const normalized = normalizeMultiline(text);
  return normalized ? normalized.split(/\n\s*\n/g) : [];
};
