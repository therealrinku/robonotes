import { useEffect, useMemo, useRef, useState } from 'react';
import useNotes from '../hooks/useNotes';
import { GoLog, GoTriangleLeft } from 'react-icons/go';
import Toolbar from '../components/Toolbar';

export default function Editor() {
  const { notes, handleUpdateNote, handleDeleteNote, openNote, setOpenNote } =
    useNotes();

  const [content, setContent] = useState('');
  const timeout0 = useRef<NodeJS.Timeout | null>(null);

  const haveUnsavedChanges = openNote?.content !== content;

  useEffect(() => {
    if (openNote && openNote.id) {
      setContent(openNote.content);
    } else {
      setContent('');
    }
  }, [openNote]);

  useEffect(() => {
    // auto save
    if (haveUnsavedChanges && openNote) {
      if (timeout0.current) {
        clearTimeout(timeout0.current);
      }

      timeout0.current = setTimeout(() => {
        handleUpdateNote(openNote.id, content);
      }, 500);
    }
  }, [content]);

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#303030] pt-2 text-sm">
      <Toolbar />

      <div className="flex flex-col h-[100vh] overflow-y-auto border-t dark:border-gray-700 mt-2">
        {openNote ? (
          <textarea
            id="editor"
            className="w-full outline-none h-[90vh] px-3 pt-1 bg-inherit dark:text-white"
            placeholder="My important note..."
            value={content}
            autoCorrect="off"
            spellCheck="false"
            autoFocus={true}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="flex flex-col h-[90vh] w-full items-center justify-center text-white text-sm gap-3">
            <GoLog color="white" size={25} />
            <p>No note opened.</p>
          </div>
        )}
      </div>
    </div>
  );
}
