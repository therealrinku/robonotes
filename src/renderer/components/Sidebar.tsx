import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  GoPlusCircle,
  GoSearch,
  GoGear,
  GoTrash,
} from 'react-icons/go';
import { PiNoteFill, PiNoteLight } from 'react-icons/pi';
import PreferencesModal from './PreferencesModal';
import useNotes from '../hooks/useNotes';
import useDir from '../hooks/useDir';
import { configs } from '../utils/configs';

interface NoteItemProps {
  noteName: string;
}

export default function Sidebar() {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredNotes = useMemo(() => {
    if (
      !Array.isArray(notes) ||
      notes.length == 0 ||
      searchQuery.trim().length === 0
    ) {
      return notes;
    }

    return notes.filter((noteName) => {
      const allQueries = searchQuery.split(',').map((item) => item.trim());

      return allQueries.every((query) => {
        /* TODO: needs update */
        // if (query.startsWith('#')) {
        //   const tagToMatch = query.slice(1);
        //   return thisNoteTags.some((tag) => tag === tagToMatch);
        // } else {
        return noteName.toLowerCase().includes(query.toLowerCase());
        // }
      });
    });
  }, [searchQuery, notes]);

  return (
    <Fragment>
      <div className="relative bg-gray-100 dark:bg-[#121212] w-[25%] min-w-[250px] max-w-[500px] min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-1 right-2 flex items-center justify-center gap-4 w-full">
          <p className="text-xs font-bold ml-auto">
            robonotes v{configs.version}
          </p>

          <button
            className="ml-auto"
            title="Preferences (Ctrl + Y)"
            onClick={() => setShowPreferencesModal(true)}
          >
            <GoGear size={15} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 w-full px-3">
          <div className=" w-full flex items-center gap-3 justify-between">
            <div className="flex items-center w-full">
              <GoSearch className="absolute ml-2 " color="gray" />
              <input
                title="Search with note name or by tag name, #tagname, note name"
                className="w-full text-xs bg-gray-200 dark:bg-[#303030] p-2 rounded pl-8 outline-blue-600"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />{' '}
            </div>

            <button
              title="Create New Note"
              onClick={handleCreateNewNote}
              className="text-lg flex items-center gap-1"
            >
              <GoPlusCircle />
            </button>
          </div>
        </div>

        <div className="w-full pb-5 flex flex-col gap-3 border-gray-200 dark:border-gray-700 border-t overflow-y-auto max-h-[85vh] px-3 pt-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((noteName: string, index) => {
              return <NoteItem key={noteName} noteName={noteName} />;
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
              <button
                onClick={handleCreateNewNote}
                className="mt-5 text-xs bg-gray-200 dark:bg-[#252526] py-2 px-5 rounded"
              >
                Create new note
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

export function NoteItem({ noteName }: NoteItemProps) {
  const {
    handleOpenNote,
    selectedNoteName,
    handleCloseNote,
    handleDeleteNote,
  } = useNotes();

  const [isHovered, setIsHovered] = useState(false);

  function handleClickNoteItem() {
    if (selectedNoteName === noteName) {
      handleCloseNote();
    } else {
      handleOpenNote(noteName);
    }
  }

  return (
    <Fragment>
      <button
        onClick={handleClickNoteItem}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-full p-2 w-full text-xs bg-gray-200 dark:bg-[#303030] outline-1  w-full rounded"
      >
        <div className="flex flex-row items-center gap-2" title={noteName}>
          {selectedNoteName === noteName ? (
            <PiNoteFill size={18} />
          ) : (
            <PiNoteLight size={18} />
          )}
          <p className={`truncate max-w-[75%]`}>{noteName}</p>
        </div>

        {isHovered && (
          <button
            className="absolute top-3 right-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNote(noteName);
            }}
          >
            <GoTrash color="red" size={13} />
          </button>
        )}
      </button>
    </Fragment>
  );
}
