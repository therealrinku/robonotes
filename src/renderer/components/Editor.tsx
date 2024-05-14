import { useEffect, useMemo, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';
import { GoFile } from 'react-icons/go';

export default function Editor() {
  const { selectedNoteName, handleCloseNote, handleSaveNote, selectedNote } =
    useNotes();
  const { tags } = useTags();

  const thisNoteTags = Object.entries(tags)
    .filter((tag) => tag[1][selectedNoteName] === true)
    .map((tg) => tg[0]);

  const [fileContent, setFileContent] = useState({ title: '', content: '' });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  function handleSave(_title: string, _description: string) {
    if (haveUnsavedChanges) {
      setFileContent({ title: _title, content: _description });
      handleSaveNote(_title, _description);
    }
  }

  function handleClose() {
    handleSaveNote(title, description);
    handleCloseNote();
  }

  const haveUnsavedChanges = useMemo(() => {
    if (fileContent.title !== title || fileContent.content !== description) {
      return true;
    }

    return false;
  }, [fileContent, title, description]);

  useEffect(() => {
    if (selectedNote) {
      setFileContent({
        title: selectedNote.title,
        content: selectedNote.content,
      });
      setTitle(selectedNote.title);
      setDescription(selectedNote.content);
    }
  }, [selectedNote]);

  // auto save feature
  let timeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (haveUnsavedChanges) {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        console.log('--autosaving--');
        handleSave(title, description);
      }, 1200);
    }

    return () => {
      if (haveUnsavedChanges) {
        handleSave(title, description);
      }

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [title, description]);

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#282828]">
      {selectedNoteName && fileContent && (
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
              defaultValue={'2023 - Memo'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoCorrect='off'
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
              onChange={(e) => setDescription(e.target.value)}
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
