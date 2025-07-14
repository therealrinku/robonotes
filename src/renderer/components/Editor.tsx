import { useEffect, useMemo, useRef, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useNotes from '../hooks/useNotes';
import { GoAlertFill, GoIssueClosed } from 'react-icons/go';

export default function Editor() {
  const {
    notes,
    selectedNoteName,
    handleRenameNote,
    handleSaveNote,
    selectedNoteContent
  } = useNotes();

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  const haveUnsavedChanges = useMemo(() => {
    if (selectedNoteContent !== description) {
      return true;
    }
    return false;
  }, [selectedNoteContent, description]);
  const wordCount = useMemo(() => {
    return description.split(/\s+/).filter((word) => word !== '').length;
  }, [description]);
  const indexOfSelectedNote = useMemo(
    () => notes.indexOf(selectedNoteName),
    [notes, selectedNoteName],
  );
  const indexOfUpdatedFileNameAkaTitle = useMemo(
    () => notes.indexOf(title),
    [notes, title],
  );
  const isUpdatedTitleValid =
    (indexOfUpdatedFileNameAkaTitle === -1 ||
      indexOfUpdatedFileNameAkaTitle === indexOfSelectedNote) &&
    title.trim().length >= 3 &&
    title.trim().length <= 120;

  function handleSaveOnCtrlS(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 's' && haveUnsavedChanges) {
      handleSaveNote(description);
    }
  }

  useEffect(() => {
    setDescription(selectedNoteContent || '');
    setTitle(selectedNoteName || '');
  }, [selectedNoteContent, selectedNoteName]);

  useEffect(() => {
    document.addEventListener('keydown', handleSaveOnCtrlS);

    return () => {
      haveUnsavedChanges && handleSaveNote(description);
      document.removeEventListener('keydown', handleSaveOnCtrlS);
    };
  }, []);

  // auto save description
  const timeout0 = useRef<NodeJS.Timeout | null>(null);
  function handleAutoSaveDescription(_description: string) {
    if (haveUnsavedChanges) {
      if (timeout0.current) {
        clearTimeout(timeout0.current);
      }

      timeout0.current = setTimeout(() => {
        haveUnsavedChanges && handleSaveNote(_description);
      }, 1000);
    }
  }

  // auto save title
  const timeout1 = useRef<NodeJS.Timeout | null>(null);
  function handleAutoSaveTitle(_title: string) {
    if (timeout1.current) {
      clearTimeout(timeout1.current);
    }

    timeout1.current = setTimeout(() => {
      if (_title.trim().length >= 3 && _title.trim().length <= 120) {
        handleRenameNote(
          indexOfSelectedNote,
          selectedNoteName,
          _title,
          description,
        );
      }
    }, 1000);
  }

  if (!selectedNoteName) {
    return (
      <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#1e1e1e]">
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
          <img src={EmptySvg} className="h-32 w-32" />
          <p className="text-xs">No note opened yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#1e1e1e]">
      <div className="relative w-full text-sm">
        <div className="flex flex-col h-[100vh] overflow-y-auto">
          <div className="">
            <input
              type="text"
              placeholder="Title..."
              className={`p-3 py-[22px] outline-none font-bold text-lg w-[85%] ml-3 bg-inherit ${!isUpdatedTitleValid && 'text-red-500'}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleAutoSaveTitle(e.target.value);
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
              handleAutoSaveDescription(e.target.value);
            }}
          />

          <div className="w-full py-1 flex items-center gap-4 text-xs justify-end pr-5">
            <p>
              <span className="font-bold">{description.length}</span> characters
            </p>
            <p>
              <span className="font-bold">{wordCount}</span> words
            </p>

            <span title={haveUnsavedChanges ? "Unsaved Changes" : "Saved"} className="flex items-center gap-1">
              {!haveUnsavedChanges ? (
                <GoIssueClosed size={15} />
              ) : (
                <GoAlertFill size={15} className="text-red-600" />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
