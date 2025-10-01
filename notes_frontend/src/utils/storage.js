const STORAGE_KEY = 'notes:v1';

/**
 * Safely parse JSON returning fallback on failure.
 */
export function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify JSON returning fallback string on failure.
 */
export function safeStringify(value, fallback = 'null') {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function getNotes() {
  /** Retrieve notes array from localStorage (versioned key). */
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

// PUBLIC_INTERFACE
export function setNotes(notes) {
  /** Persist notes array to localStorage (versioned key). */
  const str = safeStringify(notes, '[]');
  window.localStorage.setItem(STORAGE_KEY, str);
}
