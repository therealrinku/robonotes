import { useEffect, useMemo, useRef, useState } from 'react';
import useNotes from '../hooks/useNotes';
import { GoTrash, GoTriangleLeft } from 'react-icons/go';
import Toolbar from '../components/Toolbar';

export default function Editor() {
  const { notes, handleUpdateNote, handleDeleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState(
    Number(localStorage.getItem('openNoteId')) || null,
  );

  const note = notes.find((note) => note.id === selectedNoteId) || {};

  const [content, setContent] = useState('');
  const timeout0 = useRef<NodeJS.Timeout | null>(null);

  const wordCount = useMemo(
    () => content.split(/\s+/).filter((word) => word !== '').length,
    [content],
  );
  const tagsCount = useMemo(
    () =>
      content.split(/\s+|\n+/).filter((word) => word.startsWith('#')).length,
    [content],
  );

  const haveUnsavedChanges = note.content !== content;

  function handleSelectNote(id: number) {
    setSelectedNoteId(id);
    localStorage.setItem('openNoteId', id);
  }

  useEffect(() => {
    if (note.id) setContent(note.content);
  }, [note.id]);

  useEffect(() => {
    // auto save
    if (haveUnsavedChanges && note.id) {
      if (timeout0.current) {
        clearTimeout(timeout0.current);
      }
      timeout0.current = setTimeout(() => {
        handleUpdateNote(note.id, content);
      }, 1000);
    }
  }, [content]);

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#303030] pt-3">
      <Toolbar selectedNote={note} onSelectNote={(id) => handleSelectNote(id)} />

        <div className="flex flex-col h-[100vh] overflow-y-auto border-t dark:border-gray-700 mt-3">
          <textarea
            className="w-full outline-none h-full px-3 pt-1 bg-inherit dark:text-white"
            placeholder="My important note..."
            value={content}
            autoCorrect="off"
            spellCheck="false"
            autoFocus={true}
            onChange={(e) => setContent(e.target.value)}
          />
      </div>
    </div>
  );
}
