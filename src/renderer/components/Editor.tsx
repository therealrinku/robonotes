import { useEffect, useMemo, useRef, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';

export default function Editor() {
  const { selectedNoteName, handleCloseNote, handleSaveNote, selectedNote } =
    useNotes();
  const { tags } = useTags();

  const thisNoteTags = Object.entries(tags)
    .filter((tag) => tag[1][selectedNoteName] === true)
    .map((tg) => tg[0]);

  const [loadedNoteName, setLoadedNoteName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  function handleSave(_title: string, _description: string) {
    console.log(_title, _description, 'pussydick');
    if (haveUnsavedChanges) {
      handleSaveNote(_title, _description);
    }
  }

  function handleClose() {
    handleSave(title, description);
    handleCloseNote();
  }

  const haveUnsavedChanges = useMemo(() => {
    if (
      selectedNote?.title !== title ||
      selectedNote?.content !== description
    ) {
      return true;
    }

    return false;
  }, [selectedNote, title, description]);

  // load note once to prevent re-rendering issues
  // which causes issues like cursor jumping to the end in textarea and input fieldss
  useEffect(() => {
    if (selectedNote && loadedNoteName !== selectedNoteName) {
      setTitle(selectedNote?.title);
      setDescription(selectedNote?.content);
      setLoadedNoteName(selectedNoteName);
    }
  }, [selectedNote, selectedNoteName]);

  // save on unmount
  useEffect(() => {
    return () => {
      if (haveUnsavedChanges) {
        handleSave(title, description);
      }
    };
  }, []);

  // auto save feature
  const timeout = useRef<NodeJS.Timeout | null>(null);
  function handleAutoSave(_title: string, _description: string) {
    if (haveUnsavedChanges) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        console.log('--autosaving--');
        handleSave(_title, _description);
      }, 1000);
    }
  }

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#282828]">
      {selectedNoteName && (
        <div className="relative w-full text-sm">
          <div className="absolute flex flex-row items-center gap-2 my-5 self-end mx-auto right-5">
            <div className="ml-auto flex flex-row items-center gap-5">
              <button
                onClick={handleClose}
                className="text-xs bg-gray-200 dark:bg-[#404040] hover:bg-gray-300 py-2 px-5 rounded"
              >
                <p>Close</p>
              </button>
            </div>
          </div>

          <div className="flex flex-col h-[100vh] overflow-y-auto py-5">
            <input
              type="text"
              placeholder="Title..."
              className="p-3 outline-none font-bold text-lg max-w-[85%] ml-3 bg-inherit"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleAutoSave(e.target.value, description);
              }}
              autoCorrect="off"
            />

            {thisNoteTags.length > 0 && (
              <div className="flex flex-row flex-wrap items-center gap-2 pr-[4px] mx-6 text-xs">
                {(showAllTags ? thisNoteTags : thisNoteTags.slice(0, 5)).map(
                  (tag) => {
                    return (
                      <div
                        key={tag}
                        className="flex justify-center bg-gray-200 dark:bg-[#404040] py-1 px-2 rounded disabled:opacity-70"
                      >
                        #{tag}
                      </div>
                    );
                  },
                )}

                {thisNoteTags.length > 5 && (
                  <button
                    className="underline"
                    onClick={() => setShowAllTags((prev) => !prev)}
                  >
                    Show {showAllTags ? 'less' : 'all'}
                  </button>
                )}
              </div>
            )}

            <textarea
              className="w-full outline-none h-full mt-5 pt-5 border-t px-6 bg-inherit"
              placeholder="My important note..."
              value={description}
              autoCorrect="off"
              spellCheck="false"
              autoFocus={true}
              onChange={(e) => {
                setDescription(e.target.value);
                handleAutoSave(title, e.target.value);
              }}
            />
          </div>
        </div>
      )}

      {!selectedNoteName && (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
          <img src={EmptySvg} className="h-32 w-32" />
          <p className="text-xs">No note opened yet.</p>
        </div>
      )}
    </div>
  );
}
