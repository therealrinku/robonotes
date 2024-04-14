import { Fragment, useMemo, useState } from 'react';
import { FiFilePlus, FiFileText, FiSearch, FiSettings } from 'react-icons/fi';
import useRootContext from '../hooks/useRootContext';
import PreferencesModal from './PreferencesModal';

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const {
    rootDir,
    setRootDir,
    notes,
    setNotes,
    selectedNoteIndex,
    setSelectedNoteIndex,
  } = useRootContext();

  function handleCreateNewNote() {
    let newNoteTitle =
      notes.length === 0 ? 'Untitled Note' : `Untitled Note (${notes.length})`;

    window.electron.ipcRenderer.sendMessage(
      'create-note',
      rootDir,
      newNoteTitle,
    );

    //@ts-ignore
    setNotes((prev) => [...prev, newNoteTitle]);
    setSelectedNoteIndex(notes.length);
  }

  function handleSelectFolder() {
    window.electron.ipcRenderer.once('open-root-dir-selector', (arg) => {
      const path = String(arg);
      window.localStorage.setItem('rootDir', path);
      setRootDir(String(arg));
    });

    window.electron.ipcRenderer.sendMessage('open-root-dir-selector');
  }

  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes) || notes.length == 0) {
      return [];
    }

    return notes.filter((fileName) => {
      //@ts-ignore
      return fileName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, notes]);

  return (
    <Fragment>
      <div className="relative bg-gray-200 w-72 min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-3 text-xs w-full px-3 flex flex-row items-center justify-center gap-2">
          <p className="truncate max-w-[85%]">robunot v.0.0.0</p>
          <button onClick={() => setShowPreferencesModal(true)}>
            <FiSettings />
          </button>
        </div>

        <div className="px-3 flex flex-row items-center gap-3">
          <div className="relative w-full">
            <FiSearch
              className="absolute left-2 top-2"
              color="gray"
              size={13}
            />
            <input
              placeholder="Search..."
              className="bg-gray-100 pl-7 pr-2 rounded w-full text-xs py-1 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <button onClick={handleCreateNewNote} className="py-2">
              <FiFilePlus />
            </button>

            {/* <button onClick={handleNewFile} className="py-2">
            <FiTag />
          </button> */}
          </div>
        </div>

        <div className="w-full pb-5 flex flex-col gap-2 border-white border-t pt-5 overflow-y-auto max-h-[85vh] px-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((fileName: string, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setSelectedNoteIndex(index)}
                  className={`${selectedNoteIndex === index && 'outline-dashed'} h-full p-2 w-full text-xs bg-gray-100 hover:outline-dashed outline-1  w-full rounded`}
                >
                  <div className="flex flex-row items-center gap-1">
                    <FiFileText />
                    <p className="truncate max-w-[85%]">{fileName}</p>
                  </div>

                  {/* <div className="mt-2 flex flex-row items-center gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <FiTag />
                    <p>Holimoli</p>
                  </div>
                </div> */}
                </button>
              );
            })
          ) : notes.length === 0 ? (
            <div className="text-xs text-center h-[70vh] flex flex-col items-center justify-center">
              <p>No notes found.</p>
              <button
                onClick={handleSelectFolder}
                className="mt-5 text-xs bg-gray-100 py-2 px-5 rounded"
              >
                Change directory
              </button>
              <button
                onClick={handleCreateNewNote}
                className="mt-5 text-xs bg-gray-100 py-2 px-5 rounded"
              >
                Create new note
              </button>
            </div>
          ) : (
            <div className="text-xs text-center h-[70vh] flex flex-col items-center justify-center">
              <p>No notes found.</p>
            </div>
          )}
        </div>
      </div>

      {showPreferencesModal && (
        <PreferencesModal onClose={() => setShowPreferencesModal(false)} />
      )}
    </Fragment>
  );
}
