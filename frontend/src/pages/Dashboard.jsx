import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getNotes } from '../api/api';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getNotes();
        setNotes(data.notes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return notes;
    }
    return notes.filter((note) => {
      const titleMatch = note.title?.toLowerCase().includes(term);
      const contentMatch = note.content?.toLowerCase().includes(term);
      return titleMatch || contentMatch;
    });
  }, [notes, searchTerm]);

  function renderContent() {
    if (loading) {
      return <p className="loading-text">Loading notes...</p>;
    }

    if (notes.length === 0) {
      return (
        <div className="empty-state card">
          <h3>No notes yet</h3>
          <p>Create your first note to get started.</p>
          <Link to="/notes/new" className="btn btn-primary" style={{ marginTop: 16 }}>
            + New note
          </Link>
        </div>
      );
    }

    if (filteredNotes.length === 0) {
      return (
        <div className="empty-state card">
          <h3>No notes match "{searchTerm}"</h3>
          <p>Try a different search term.</p>
        </div>
      );
    }

    return (
      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    );
  }

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header">
        <h1>Your notes</h1>
        <Link to="/notes/new" className="btn btn-primary">
          + New note
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && notes.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search notes"
          />
        </div>
      )}

      {renderContent()}
    </div>
  );
}