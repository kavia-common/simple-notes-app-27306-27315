import { render, screen } from '@testing-library/react';
import App from './App';

test('renders New Note button, search input, and empty state on first load', () => {
  render(<App />);
  // New Note buttons can exist in multiple places; check at least one present
  const newNoteButtons = screen.getAllByRole('button', { name: /new note/i });
  expect(newNoteButtons.length).toBeGreaterThan(0);

  // Search input placeholder
  const searchInput = screen.getByPlaceholderText(/search notes…/i);
  expect(searchInput).toBeInTheDocument();

  // Empty state text
  const emptyText = screen.getByText(/no notes yet/i);
  expect(emptyText).toBeInTheDocument();
});
