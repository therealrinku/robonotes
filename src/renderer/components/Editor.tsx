import { useEffect, useMemo, useState } from 'react';
import useRootContext from '../hooks/useRootContext';
import EmptySvg from '../assets/images/empty.svg';

export default function Editor() {
  const { selectedNoteIndex, rootDir, notes, setSelectedNoteIndex } =
    useRootContext();
  const selectedNote = notes[selectedNoteIndex];

  const [fileContent, setFileContent] = useState({
    title: '',
    content: '',
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSave(title: string, description: string) {
    window.electron.ipcRenderer.once('open-root-dir-selector', (arg) => {
      //@ts-ignore
      setFileContent({ title: title, content: description });
    });

    const args = [rootDir, selectedNote, title, description];
    window.electron.ipcRenderer.sendMessage('save-file', args);
  }

  useEffect(() => {
    if (selectedNote) {
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
        selectedNote,
      );
    }
  }, [selectedNote]);

  const haveUnsavedChanges = useMemo(() => {
    if (fileContent.title !== title || fileContent.content !== description) {
      return true;
    }

    return false;
  }, [fileContent, title, description]);

  return (
    <div className="w-full">
      {selectedNote && fileContent && (
        <div className="w-full text-sm">
          <div className="flex flex-row items-center gap-2 p-3 self-end mx-auto">
            {/* <div className="text-xs py-2 px-3 rounded bg-gray-100 flex flex-row items-center gap-5">
            <button className="hover:text-green-800">
              <FiBold />
            </button>
            <button className="hover:text-green-800">
              <FiItalic />
            </button>
          </div> */}

            <div className="ml-auto flex flex-row items-center gap-2">
              <button
                onClick={() => handleSave(title, description)}
                className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded"
              >
                <p>Save</p>
                <p>{haveUnsavedChanges ? '*' : ''}</p>
              </button>

              <button
                onClick={() => setSelectedNoteIndex(-1)}
                className="text-xs bg-red-300 hover:bg-red-200 py-2 px-5 rounded"
              >
                <p>Close</p>
              </button>
            </div>
          </div>

          <div className="flex flex-col mr-2">
            <input
              type="text"
              placeholder="Title..."
              className="p-3 outline-none font-bold text-lg"
              autoFocus={true}
              defaultValue={'2023 - Memo'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full h-[80vh] p-3 outline-none"
              placeholder="My important note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      )}

      {!selectedNote && (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
          <img src={EmptySvg} className="h-32 w-32" />
          <p className="text-xs">No note opened yet.</p>
        </div>
      )}
    </div>
  );
}
