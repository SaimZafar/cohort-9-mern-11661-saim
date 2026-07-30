import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  return doc.body.textContent || '';
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
export default function NoteCard({ note }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="note-card card" onClick={() => navigate(`/notes/${note.id}`)} >
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-preview">{stripHtml(note.content) || 'No content yet'}</p>
      <p className="note-card-date">{formatDate(note.updated_at)}</p>
    </button>
  );
}
NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
};