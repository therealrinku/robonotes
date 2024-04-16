import { useEffect, useMemo, useState } from 'react';
import EmptySvg from '../assets/images/empty.svg';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';
import useDir from '../hooks/useDir';
import { FiBold, FiItalic } from 'react-icons/fi';

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
        handleSave(title, description);
      }, 1200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [title, description]);

  return (
    <div className="w-full max-h-[100vh] overflow-hidden">
      {selectedNoteName && fileContent && (
        <div className="w-full text-sm">
          <div className="flex flex-row items-center gap-2 p-3 self-end mx-auto">
            <div className="ml-auto flex flex-row items-center gap-2">
              <button
                disabled={!haveUnsavedChanges}
                onClick={() => handleSave(title, description)}
                className="flex items-center text-xs bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
              >
                <p>Save</p>
                <p>{haveUnsavedChanges ? '*' : ''}</p>
              </button>

              <button
                onClick={handleCloseNote}
                className="text-xs bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
              >
                <p>Close</p>
              </button>
            </div>
          </div>

          <div className="flex flex-col h-[90vh] overflow-y-auto">
            <input
              type="text"
              placeholder="Title..."
              className="p-3 outline-none font-bold text-lg"
              autoFocus={true}
              defaultValue={'2023 - Memo'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {thisNoteTags.length > 0 && (
              <div className="flex flex-row flex-wrap items-center gap-2 pb-5 pl-2 pr-[4px]">
                {thisNoteTags.map((tag) => {
                  return (
                    <div
                      key={tag}
                      className="flex justify-center text-xs bg-gray-200 p-1 px-5 rounded-full disabled:opacity-70"
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            )}

            <textarea
              className="w-full pb-5 px-3 outline-none h-full"
              placeholder="My important note..."
              value={description}
              autoCorrect="off"
              spellCheck="false"
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
