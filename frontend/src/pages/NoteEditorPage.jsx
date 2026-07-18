import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, createNote, updateNote, deleteNote } from '../api/api';
import RichTextEditor from '../components/RichTextEditor';

export default function NoteEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    async function fetchNote() {
      try {
        const data = await getNote(id);
        setTitle(data.note.title);
        setContent(data.note.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id, isEditing]);

  async function handleSave() {
    if (!title.trim()) {
      setError('Please add a title before saving');
      return;
    }

    setError('');
    setSaving(true);

    try {
      if (isEditing) {
        await updateNote(id, title, content);
      } else {
        await createNote(title, content);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this note? This cannot be undone.')) return;

    try {
      await deleteNote(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCancel() {
    navigate('/dashboard');
  }

  if (loading) {
    return <p className="loading-text">Loading note...</p>;
  }

  return (
    <div className="container editor-page">
      <div className="editor-header">
        <h1>{isEditing ? 'Edit note' : 'New note'}</h1>
        {isEditing && (
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <input
        type="text"
        className="editor-title-input"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <RichTextEditor value={content} onChange={setContent} />

      <div className="editor-actions">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button className="btn btn-outline" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}