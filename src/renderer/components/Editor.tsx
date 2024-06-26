import { useEffect, useMemo, useRef, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useNotes from '../hooks/useNotes';
import { GoAlertFill, GoIssueClosed } from 'react-icons/go';

export default function Editor() {
  const {
    selectedNoteName,
    handleRenameNote,
    handleSaveNote,
    selectedNoteContent,
  } = useNotes();

  const [description, setDescription] = useState('');

  function handleSave(_description: string) {
    if (haveUnsavedChanges) {
      handleSaveNote(_description);
    }
  }

  function handleSaveOnCtrlS(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 's') {
      handleSave(description);
    }
  }

  const haveUnsavedChanges = useMemo(() => {
    if (selectedNoteContent !== description) {
      return true;
    }
    return false;
  }, [selectedNoteContent, description]);

  useEffect(() => {
    setDescription(selectedNoteContent || '');
  }, [selectedNoteContent]);

  useEffect(() => {
    document.addEventListener('keydown', handleSaveOnCtrlS);

    return () => {
      haveUnsavedChanges && handleSave(description);
      document.removeEventListener('keydown', handleSaveOnCtrlS);
    };
  }, []);

  // auto save feature
  const timeout = useRef<NodeJS.Timeout | null>(null);
  function handleAutoSave(_description: string) {
    if (haveUnsavedChanges) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        console.log('--autosaving--');
        handleSave(_description);
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
        <div className="flex flex-col h-[100vh] overflow-y-auto">
          <div className="">
            <input
              type="text"
              placeholder="Title..."
              className="p-3 py-[22px] outline-none font-bold text-lg max-w-[85%] ml-3 bg-inherit"
              value={selectedNoteName}
              onChange={(e) => {
                if (!e.target.value.trim()) {
                  return;
                }
                handleRenameNote(0, selectedNoteName, e.target.value);
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
              handleAutoSave(e.target.value);
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
