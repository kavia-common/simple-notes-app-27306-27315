import React from 'react';
import NoteList from './NoteList';

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedNoteId,
  onSelect,
  onDelete,
  onCreate,
  search,
  setSearch,
  mobileOpen,
  setMobileOpen
}) {
  /** Sidebar with title, New Note button, search input, and note list. */
  return (
    <>
      <div
        className={`sidebar ${mobileOpen ? 'open' : ''}`}
        aria-label="Sidebar navigation"
      >
        <div className="sidebar-header">
          <div className="brand" aria-label="Application Brand">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-title">Simple Notes</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              onCreate();
              setMobileOpen(false);
            }}
            aria-label="Create a new note"
          >
            ＋ New Note
          </button>
        </div>
        <div className="sidebar-content">
          <div className="search">
            <span className="icon" aria-hidden="true">🔍</span>
            <label htmlFor="search" className="visually-hidden">Search notes</label>
            <input
              id="search"
              className="input"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notes"
            />
          </div>
          <NoteList
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelect={(id) => {
              onSelect(id);
              setMobileOpen(false);
            }}
            onDelete={onDelete}
          />
        </div>
      </div>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
    </>
  );
}
