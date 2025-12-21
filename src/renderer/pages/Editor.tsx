import { useEffect, useMemo, useRef, useState } from 'react';
import useNotes from '../hooks/useNotes';
import { GoTrash, GoTriangleLeft } from 'react-icons/go';
import SearchModal from '../components/SearchModal.tsx';

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
      <SearchModal onSelectNote={(id) => handleSelectNote(id)} />

      <div className="relative w-full text-sm">
        <div className="flex flex-col h-[100vh] overflow-y-auto border-t dark:border-gray-700 mt-3">
          <textarea
            className="w-full outline-none h-full px-3 pt-1 bg-inherit dark:text-white border-b dark:border-gray-700 mb-[70px] pb-3"
            placeholder="My important note..."
            value={content}
            autoCorrect="off"
            spellCheck="false"
            autoFocus={true}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="fixed bottom-0 w-full p-2 flex items-center gap-4 text-xs justify-end bg-gray-100 dark:bg-[#1e1e1e] dark:border-gray-700 dark:text-white border-l">
            <p>
              <span className="font-bold">{content.length}</span> characters
            </p>
            <p>
              <span className="font-bold">{wordCount}</span> words
            </p>
            <p>
              <span className="font-bold">{tagsCount}</span> tags
            </p>
            <p
              className={`${haveUnsavedChanges ? 'bg-red-500' : 'bg-green-500'} h-2 w-2 rounded-full`}
            ></p>
          </div>
        </div>
      </div>
    </div>
  );
}
