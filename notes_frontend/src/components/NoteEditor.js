import React, { useMemo } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete }) {
  /** Editor for a selected note; updates propagate to parent. */
  const created = useMemo(() => {
    return note ? new Date(note.createdAt).toLocaleString() : '';
  }, [note]);

  const updated = useMemo(() => {
    return note ? new Date(note.updatedAt).toLocaleString() : '';
  }, [note]);

  if (!note) return null;

  return (
    <div className="editor" aria-label="Note editor">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label htmlFor="title" className="visually-hidden">Title</label>
        <input
          id="title"
          className="input title-input"
          placeholder="Untitled"
          value={note.title}
          onChange={(e) => onChange({ ...note, title: e.target.value })}
          aria-label="Note title"
        />
        <button
          className="btn btn-danger"
          onClick={() => {
            const ok = window.confirm('Delete this note?');
            if (ok) onDelete(note.id);
          }}
          aria-label="Delete current note"
        >
          Delete
        </button>
      </div>
      <label htmlFor="content" className="visually-hidden">Content</label>
      <textarea
        id="content"
        className="input content-textarea"
        placeholder="Start typing..."
        value={note.content}
        onChange={(e) => onChange({ ...note, content: e.target.value })}
        aria-label="Note content"
      />
      <div className="timestamps" aria-live="polite">
        <span>Created {created}</span> • <span>Updated {updated}</span>
      </div>
    </div>
  );
}
