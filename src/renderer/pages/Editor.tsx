import { useEffect, useRef, useState } from 'react';
import { GoLog } from 'react-icons/go';
import useNotes from '../hooks/useNotes';
import Toolbar from '../components/Toolbar';

export default function Editor() {
  const { handleUpdateNote, openNote } = useNotes();

  const [content, setContent] = useState(openNote?.content || '');
  const timeout0 = useRef<NodeJS.Timeout | null>(null);

  const haveUnsavedChanges = openNote?.content !== content;

  useEffect(() => {
    setContent(openNote?.content || '');
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
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#303030] text-sm">
      <Toolbar />

      <div className="flex flex-col h-[100vh] overflow-y-auto mt-2">
        {openNote ? (
          <textarea
            id="editor"
            className="w-full outline-none h-[92vh] px-3 pt-1 bg-inherit dark:text-white"
            placeholder="My important note..."
            value={content}
            autoFocus={!content}
            autoCorrect="off"
            spellCheck="false"
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="flex flex-col gap-5 h-[90vh] w-full items-center justify-center text-white text-sm">
            <GoLog color="white" size={50} />
            <b>No open note.</b>

            <div className="flex flex-col items-end gap-3 bg-[#333333] px-32 py-5">
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
              <p className="flex items-center gap-2">
                <span>Close open note</span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  ⌘
                </span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  c
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span>Delete open note</span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  ⌘
                </span>
                <span className="bg-gray-500 py-1 w-8 flex justify-center">
                  f
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
