import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    isFirstRender.current = false;
  }, [value]);
  function handleInput() {
    onChange(editorRef.current.innerHTML);
  }
  function format(command) {
    document.execCommand(command, false, null); // NOSONAR - no modern replacement for this simple use case
    editorRef.current.focus();
    handleInput();
  }
  function formatList(type) {
    document.execCommand(type, false, null); // NOSONAR - no modern replacement for this simple use case
    editorRef.current.focus();
    handleInput();
  }
  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        <button type="button" onClick={() => format('bold')} title="Bold">
          <b>B</b>
        </button>
        <button type="button" onClick={() => format('italic')} title="Italic">
          <i>I</i>
        </button>
        <button type="button" onClick={() => format('underline')} title="Underline">
          <u>U</u>
        </button>
        <span className="rich-editor-divider" />
        <button
          type="button"
          onClick={() => formatList('insertUnorderedList')}
          title="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => formatList('insertOrderedList')}
          title="Numbered list"
        >
          1. List
        </button>
      </div>

      <div
        ref={editorRef}
        className="rich-editor-content"
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  );
}
RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};