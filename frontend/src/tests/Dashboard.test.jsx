import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import * as api from '../api/api';

jest.mock('../api/api');

const mockNotes = [
  { id: 1, title: 'Grocery list', content: '<p>Milk, eggs, bread</p>', updated_at: '2026-01-15T10:00:00Z' },
  { id: 2, title: 'Work plan', content: '<p>Finish the report</p>', updated_at: '2026-01-16T10:00:00Z' },
];

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state before notes arrive', () => {
    api.getNotes.mockReturnValue(new Promise(() => {})); // never resolves
    renderDashboard();
    expect(screen.getByText('Loading notes...')).toBeInTheDocument();
  });

  it('shows an empty state when there are no notes', async () => {
    api.getNotes.mockResolvedValue({ notes: [] });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('No notes yet')).toBeInTheDocument();
    });
  });

  it('renders all fetched notes', async () => {
    api.getNotes.mockResolvedValue({ notes: mockNotes });
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Grocery list')).toBeInTheDocument();
      expect(screen.getByText('Work plan')).toBeInTheDocument();
    });
  });

  it('shows an error message when fetching notes fails', async () => {
    api.getNotes.mockRejectedValue(new Error('Failed to load notes'));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Failed to load notes')).toBeInTheDocument();
    });
  });

  it('filters notes by title as the user types', async () => {
    api.getNotes.mockResolvedValue({ notes: mockNotes });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Grocery list')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Search notes'), {
      target: { value: 'grocery' },
    });

    expect(screen.getByText('Grocery list')).toBeInTheDocument();
    expect(screen.queryByText('Work plan')).not.toBeInTheDocument();
  });

  it('filters notes by content as well as title', async () => {
    api.getNotes.mockResolvedValue({ notes: mockNotes });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Grocery list')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Search notes'), {
      target: { value: 'report' },
    });

    expect(screen.getByText('Work plan')).toBeInTheDocument();
    expect(screen.queryByText('Grocery list')).not.toBeInTheDocument();
  });

  it('shows a no-results message when search matches nothing', async () => {
    api.getNotes.mockResolvedValue({ notes: mockNotes });
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Grocery list')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Search notes'), {
      target: { value: 'nonexistent term' },
    });

    expect(screen.getByText(/No notes match/)).toBeInTheDocument();
  });
});