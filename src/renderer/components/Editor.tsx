import { useEffect, useMemo, useRef, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';
import {
  GoAlert,
  GoAlertFill,
  GoCheck,
  GoInfo,
  GoIssueClosed,
} from 'react-icons/go';

export default function Editor() {
  const { selectedNoteName, handleCloseNote, handleSaveNote, selectedNote } =
    useNotes();
  const { tags } = useTags();

  const thisNoteTags = Object.entries(tags)
    .filter((tag) => tag[1][selectedNoteName] === true)
    .map((tg) => tg[0]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  function handleSave(_title: string, _description: string) {
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

  useEffect(() => {
    setTitle(selectedNote?.title || '');
    setDescription(selectedNote?.content || '');
  }, [selectedNote]);

  // save on unmount
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        handleSave(title, description);
      }
    });

    return () => {
      if (haveUnsavedChanges) {
        handleSave(title, description);
      }

      document.removeEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
          handleSave(title, description);
        }
      });
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

  if (!selectedNoteName) {
    return (
      <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#282828]">
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
          <img src={EmptySvg} className="h-32 w-32" />
          <p className="text-xs">No note opened yet.</p>
        </div>
      </div>
    );
  }

  const wordCount = description.split(' ').filter((word) => word !== '').length;

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#282828]">
      <div className="relative w-full text-sm">
        {/* <div className="absolute flex flex-row items-center gap-2 my-5 self-end mx-auto right-5">
            <div className="ml-auto flex flex-row items-center gap-5">
              <button
                onClick={handleClose}
                className="text-xs bg-gray-200 dark:bg-[#404040] hover:bg-gray-300 py-2 px-5 rounded"
              >
                <p>Close</p>
              </button>
            </div>
          </div> */}

        <div className="flex flex-col h-[100vh] overflow-y-auto">
          <div className="">
            <input
              type="text"
              placeholder="Title..."
              className="p-3 py-[22px] outline-none font-bold text-lg max-w-[85%] ml-3 bg-inherit"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleAutoSave(e.target.value, description);
              }}
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <textarea
            className="w-full outline-none h-full py-3 border-b border-t border-gray-200 dark:border-gray-700 px-6 bg-inherit"
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

          <div className="w-full py-1 flex items-center gap-4 text-xs justify-end pr-5">
            <span className="flex items-center gap-1">
              {!haveUnsavedChanges ? (
                <GoIssueClosed size={15} />
              ) : (
                <GoAlertFill size={15} className="text-red-600" />
              )}
              <p className={`${haveUnsavedChanges && 'text-red-600'}`}>
                {haveUnsavedChanges ? 'Unsaved Changes (Ctrl + S)' : 'Saved'}{' '}
              </p>
            </span>

            <p>
              <span className="font-bold"> {thisNoteTags.length}</span> Tags
            </p>
            <p>
              <span className="font-bold">{description.length}</span> characters
            </p>
            <p>
              <span className="font-bold">{wordCount}</span> words
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
