import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  /** Empty state prompts to create a note. */
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-title">No notes yet</div>
      <div className="empty-desc">Get started by creating your first note.</div>
      <button className="btn btn-primary" onClick={onCreate} aria-label="Create your first note">
        ＋ New Note
      </button>
    </div>
  );
}
