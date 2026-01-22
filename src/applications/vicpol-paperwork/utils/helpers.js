const STORAGE_KEY = "vicpol-paperwork:drafts:v2";
const AUTOSAVE_KEY = "vicpol-paperwork:autosave";

export const loadDrafts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const saveDrafts = (drafts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export const saveAutosave = (state) => {
  const quick = { ...state, drafts: undefined };
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(quick));
};

export const loadAutosave = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTOSAVE_KEY));
  } catch {
    return null;
  }
};

export const ensureLines = (text) => {
  const t = (text || "").replace(/\r/g, "").trim();
  if (!t) return "";
  return t.split("\n").map(x => x.trim()).filter(Boolean).join("\n");
};

export const norm = (s) => (s || "").trim();

export const splitToBullets = (text) => {
  const t = ensureLines(text);
  if (!t) return "";
  const lines = t.split("\n").map(x => x.trim()).filter(Boolean);
  return lines.map(x => (x.startsWith("- ") ? x : "- " + x)).join("\n");
};

export const parseOCR = (text) => {
  const t = text.toUpperCase();
  const grab = (re) => {
    const m = t.match(re);
    return m ? m[1].trim() : "";
  };
  return {
    name: grab(/NAME[:\s]+([A-Z ,'-]+)/),
    dob: grab(/DOB[:\s]+([0-9-\/]+)/),
    sex: grab(/SEX[:\s]+([MF])/),
    address: grab(/(HOME\s*ADDR|ADDRESS)[:\s]+(.+)/),
    phone: grab(/PHONE[:\s]+([0-9]+)/)
  };
};

export const uniqueCategories = (charges) => {
  return Array.from(new Set(charges.map(c => c.cat))).sort((a, b) => a.localeCompare(b));
};
