import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoPlusCircle, GoSearch, GoGear } from 'react-icons/go';
import PreferencesModal from '../components/PreferencesModal';
import SearchModal from '../components/SearchModal.tsx';
import useNotes from '../hooks/useNotes';
import useDir from '../hooks/useDir';

interface NoteItemProps {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const { notes, handleCreateNewNote } = useNotes();
  const { handleChangeDir } = useDir();

  function handleShortcuts(e: KeyboardEvent) {
    // if (e.ctrlKey && e.key === 'n') {
    //   handleCreateNewNote();
    // }
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('open-preferences', () => {
      setShowPreferencesModal(true);
    });

    document.addEventListener('keydown', handleShortcuts);
    return () => document.removeEventListener('keydown', handleShortcuts);
  }, []);

  return (
    <Fragment>
      <div className="relative bg-white dark:bg-[#121212] w-full min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-1 right-2 flex items-center justify-center gap-4 w-full">
          <button
            className="ml-auto dark:text-white"
            title="Preferences (Ctrl + Y)"
            onClick={() => setShowPreferencesModal(true)}
          >
            <GoGear size={15} />
          </button>
        </div>

        <SearchModal />

        <div className="w-full pb-5 flex flex-col border-gray-200 dark:border-gray-700 border-t overflow-y-auto max-h-[85vh]">
          {notes.length > 0 ? (
            notes
              .sort(
                (note1, note2) =>
                  new Date(note2.updated_at).getTime() -
                  new Date(note1.updated_at).getTime(),
              )
              .map((note) => {
                return <NoteItem key={note.id} note={note} />;
              })
          ) : notes.length === 0 ? (
            <div className="text-xs text-center h-[70vh] flex flex-col items-center justify-center">
              <p>No notes found.</p>
              <button
                onClick={handleChangeDir}
                className="mt-5 text-xs bg-gray-200 dark:bg-[#252526] py-2 px-5 rounded"
              >
                Change directory
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {showPreferencesModal && (
        <PreferencesModal
          handleChangeDir={handleChangeDir}
          onClose={() => setShowPreferencesModal(false)}
        />
      )}
    </Fragment>
  );
}

export function NoteItem({ note }: { note: NoteItemProps }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <button
        onClick={() => navigate(`/note/${note.id}`)}
        className="h-full w-full text-xs outline-1 w-full border-b border-gray-200 dark:border-gray-700 px-4 py-4 hover:bg-gray-200 dark:hover:bg-gray-900 dark:text-white"
      >
        <div className="flex text-left flex-col items-start gap-2">
          <p
            className={`max-w-full line-clamp-1 ${!note.content.trim() && 'italic'}`}
          >
            {note.content.trim() || '(no content)'}
          </p>
        </div>
      </button>
    </Fragment>
  );
}
