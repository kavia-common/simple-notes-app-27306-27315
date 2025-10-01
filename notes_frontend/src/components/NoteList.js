import React, { useMemo, useCallback } from 'react';

// PUBLIC_INTERFACE
export default function NoteList({ notes, selectedNoteId, onSelect, onDelete }) {
  /** Renders a list of notes with title, snippet, updatedAt; supports select and delete. */

  const formatDate = useCallback((ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return '';
    }
  }, []);

  const items = useMemo(() => notes || [], [notes]);

  if (!items.length) {
    return (
      <div aria-live="polite" style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>
        No notes found
      </div>
    );
  }

  return (
    <ul className="note-list" role="listbox" aria-label="Notes">
      {items.map((n) => {
        const selected = n.id === selectedNoteId;
        const snippet = (n.content || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        return (
          <li
            key={n.id}
            className="note-item"
            role="option"
            aria-selected={selected}
            tabIndex={0}
            onClick={() => onSelect(n.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(n.id);
              }
            }}
          >
            <div className="note-meta">
              <div className="note-title" title={n.title || 'Untitled'}>
                {n.title || 'Untitled'}
              </div>
              <div className="note-snippet">{snippet}</div>
              <div className="note-updated">Updated {formatDate(n.updatedAt)}</div>
            </div>
            <div>
              <button
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  const ok = window.confirm('Delete this note? This action cannot be undone.');
                  if (ok) onDelete(n.id);
                }}
                aria-label={`Delete note ${n.title || 'Untitled'}`}
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
