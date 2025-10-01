import { useEffect, useRef } from 'react';
import { getNotes, setNotes } from '../utils/storage';

/**
 * Debounce utility to delay function execution.
 */
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);
  return (...args) => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// PUBLIC_INTERFACE
export function useNotesLocalStorage(notes, setNotesState, delay = 300) {
  /**
   * Hook to load notes from localStorage on mount and persist on changes with debounce.
   * - Loads once on mount and updates state.
   * - Debounced persist for subsequent notes changes.
   */
  // Load on mount
  useEffect(() => {
    const existing = getNotes();
    if (Array.isArray(existing)) {
      setNotesState(existing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist when notes change (debounced)
  const debouncedPersist = useDebouncedCallback((n) => setNotes(n), delay);
  useEffect(() => {
    if (!Array.isArray(notes)) return;
    debouncedPersist(notes);
  }, [notes, debouncedPersist]);
}
