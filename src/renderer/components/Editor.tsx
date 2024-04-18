import { Fragment, useEffect, useMemo, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';
import useDir from '../hooks/useDir';

export default function Editor() {
  const { selectedNoteName, handleCloseNote, handleSaveNote } = useNotes();
  const { rootDir } = useDir();
  const { tags } = useTags();

  const thisNoteTags = Object.entries(tags)
    .filter(
      //@ts-ignore
      (tag) => tag[1][selectedNoteName] === true,
    )
    .map((tg) => tg[0]);

  const [fileContent, setFileContent] = useState({
    title: '',
    content: '',
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [autoSavedTimestamp, setAutoSavedTimestamp] = useState<number | null>(
    null,
  );

  const [showAllTags, setShowAllTags] = useState(false);

  function handleSave(title: string, description: string) {
    setFileContent({ title: title, content: description });
    handleSaveNote(title, description);
  }

  useEffect(() => {
    if (selectedNoteName) {
      window.electron.ipcRenderer.on('read-note', (arg) => {
        //@ts-ignore
        setFileContent(arg);
        //@ts-ignore

        setTitle(arg.title);
        //@ts-ignore

        setDescription(arg.content);
      });

      window.electron.ipcRenderer.sendMessage(
        'read-note',
        rootDir,
        selectedNoteName,
      );
    }
  }, [selectedNoteName]);

  const haveUnsavedChanges = useMemo(() => {
    if (fileContent.title !== title || fileContent.content !== description) {
      return true;
    }

    return false;
  }, [fileContent, title, description]);

  // auto save feature
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (haveUnsavedChanges) {
      //@ts-ignore
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        console.log('---autosaving---');
        setAutoSavedTimestamp(Date.now());
        handleSave(title, description);
      }, 1200);
    }
  }, [title, description]);

  useEffect(() => {
    //@ts-expect-error
    let timeout: NodeJS.Timeout = null;
    if (autoSavedTimestamp) {
      timeout = setTimeout(() => setAutoSavedTimestamp(null), 2000);
    } else {
      clearTimeout(timeout);
    }
  }, [autoSavedTimestamp]);

  return (
    <div className="w-full max-h-[100vh] overflow-hidden">
      {selectedNoteName && fileContent && (
        <div className="relative w-full text-sm">
          <div className="absolute flex flex-row items-center gap-2 my-5 self-end mx-auto right-5">
            <div className="ml-auto flex flex-row items-center gap-5">
              {autoSavedTimestamp && <p className="text-xs">Saving....</p>}

              <button
                onClick={handleCloseNote}
                className="text-xs bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
              >
                <p>Close</p>
              </button>
            </div>
          </div>

          <div className="flex flex-col h-[100vh] overflow-y-auto py-5">
            <input
              type="text"
              placeholder="Title..."
              className="p-3 outline-none font-bold text-lg max-w-[85%] ml-3"
              defaultValue={'2023 - Memo'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {thisNoteTags.length > 0 && (
              <div className="flex flex-row flex-wrap items-center gap-2 pr-[4px] mx-5 text-xs">
                {(showAllTags ? thisNoteTags : thisNoteTags.slice(0, 5)).map(
                  (tag) => {
                    return (
                      <div
                        key={tag}
                        className="flex justify-center bg-gray-200 py-1 px-2 rounded disabled:opacity-70"
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
              className="w-full outline-none h-full mt-5 pt-5 border-t px-5"
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
