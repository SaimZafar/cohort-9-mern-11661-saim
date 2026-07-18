import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NoteCard from '../components/NoteCard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NoteCard', () => {
  const note = {
    id: 1,
    title: 'Grocery list',
    content: '<p>Milk, eggs, bread</p>',
    updated_at: '2026-01-15T10:00:00Z',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  function renderCard(props = {}) {
    return render(
      <MemoryRouter>
        <NoteCard note={{ ...note, ...props }} />
      </MemoryRouter>
    );
  }

  it('renders the note title', () => {
    renderCard();
    expect(screen.getByText('Grocery list')).toBeInTheDocument();
  });

  it('strips HTML tags from the content preview', () => {
    renderCard();
    expect(screen.getByText('Milk, eggs, bread')).toBeInTheDocument();
  });

  it('shows a fallback message when content is empty', () => {
    renderCard({ content: '' });
    expect(screen.getByText('No content yet')).toBeInTheDocument();
  });

  it('formats the updated_at date', () => {
    renderCard();
    expect(screen.getByText('Jan 15, 2026')).toBeInTheDocument();
  });

  it('navigates to the note detail page on click', () => {
    renderCard();
    fireEvent.click(screen.getByText('Grocery list'));
    expect(mockNavigate).toHaveBeenCalledWith('/notes/1');
  });
});