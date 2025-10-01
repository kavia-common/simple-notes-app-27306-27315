import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './index.css';
import './styles/theme.css';
import './styles/layout.css';
import './styles/components.css';
import './App.css';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { useNotesLocalStorage } from './hooks/useLocalStorage';

// Note type: { id, title, content, createdAt, updatedAt }

// Helpers
function generateId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return String(Date.now());
}

// PUBLIC_INTERFACE
function App() {
  /** Main application component orchestrating notes, selection, search and persistence. */
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load and persist to localStorage
  useNotesLocalStorage(notes, setNotes, 300);

  // Derived: filtered notes by search
  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    /** Creates a new note and selects it. */
    const now = Date.now();
    const newNote = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  }, []);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((note) => {
    /** Updates title/content and updatedAt for a note. */
    const updated = { ...note, updatedAt: Date.now() };
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  }, []);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    /** Deletes a note, adjusts selection. */
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      const newArr = prev.filter((n) => n.id !== id);
      if (selectedNoteId === id) {
        const next = newArr[Math.min(idx, newArr.length - 1)];
        setSelectedNoteId(next ? next.id : null);
      }
      return newArr;
    });
  }, [selectedNoteId]);

  // Keyboard navigation within filtered list
  useEffect(() => {
    const handleKey = (e) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;

      const list = filteredNotes;
      if (!list.length) return;

      e.preventDefault();
      const currentIdx = list.findIndex((n) => n.id === selectedNoteId);
      if (e.key === 'ArrowDown') {
        const nextIdx = currentIdx < 0 ? 0 : Math.min(currentIdx + 1, list.length - 1);
        setSelectedNoteId(list[nextIdx].id);
      } else if (e.key === 'ArrowUp') {
        const prevIdx = currentIdx < 0 ? 0 : Math.max(currentIdx - 1, 0);
        setSelectedNoteId(list[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [filteredNotes, selectedNoteId]);

  return (
    <div className="app app-shell">
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onDelete={deleteNote}
        onCreate={createNote}
        search={search}
        setSearch={setSearch}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="main">
        <div className="main-header">
          <div className="mobile-toggle">
            <button
              className="btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              ☰ Menu
            </button>
          </div>
          <div />
          <div>
            <button className="btn btn-primary" onClick={createNote} aria-label="Create new note">
              ＋ New Note
            </button>
          </div>
        </div>
        <div className="main-content">
          {notes.length === 0 ? (
            <EmptyState onCreate={createNote} />
          ) : selectedNote ? (
            <NoteEditor note={selectedNote} onChange={updateNote} onDelete={deleteNote} />
          ) : (
            <EmptyState onCreate={createNote} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
