import { useEffect, useRef, useState } from 'react';
import { GoLog, GoSearch } from 'react-icons/go';
import useNotes from '../hooks/useNotes';
import Toolbar from '../components/Toolbar';

export default function Editor() {
  const {
    handleOpenNote,
    handleUpdateNote,
    handleCreateNewNote,
    openNote,
    notes,
    recentNotesId,
  } = useNotes();

  const recentNotes = notes.filter((note) => recentNotesId.includes(note.id));

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

      <div className="flex flex-col h-[100vh] overflow-y-auto mt-2">
        {openNote ? (
          <textarea
            id="editor"
            className="w-full outline-none h-[92vh] px-3 pt-1 bg-inherit dark:text-white"
            placeholder="My important note..."
            value={content}
            autoCorrect="off"
            spellCheck="false"
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="flex flex-col gap-5 h-[90vh] w-full items-center justify-center text-white text-sm">
            <GoLog color="white" size={50} />
            <b>No open note.</b>

            <div className="flex flex-col items-center gap-3">
              <p className="flex items-center gap-2">
                <span>Create new note</span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  ⌘
                </span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  +
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span>Search notes</span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  ⌘
                </span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  p
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
