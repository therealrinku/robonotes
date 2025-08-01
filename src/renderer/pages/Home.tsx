import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoPlusCircle,
  GoSearch,
  GoGear,
  GoTrash,
} from 'react-icons/go';
import { PiNoteFill, PiNoteLight } from 'react-icons/pi';
import PreferencesModal from '../components/PreferencesModal';
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

    return notes.filter((note) => {
      const allQueries = searchQuery.split(',').map((item) => item.trim());

      return allQueries.every((query) => {
        if (query.startsWith('#')) {
          const allTags = note.content.split(/\s+|\n+/).filter(word => word.startsWith("#"));
          return allTags.includes(query);
        } else {
          return note.content.toLowerCase().includes(query.toLowerCase());
        }
      });
    });
  }, [searchQuery, notes]);

  return (
    <Fragment>
      <div className="relative bg-gray-100 dark:bg-[#121212] w-full min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-1 right-2 flex items-center justify-center gap-4 w-full">
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
                title="Search with note content or by tag name, #tagname, note content"
                className="w-full text-xs bg-gray-200 dark:bg-[#303030] p-2 rounded pl-8 outline-none"
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

        <div className="w-full pb-5 flex flex-col border-gray-200 dark:border-gray-700 border-t overflow-y-auto max-h-[85vh]">
          {filteredNotes.length > 0 ? (
            filteredNotes.sort((note1, note2) => new Date(note2.updated_at).getTime() - new Date(note1.updated_at).getTime()).map((note) => {
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

export function NoteItem({ note }: NoteItemProps) {
  const { handleDeleteNote } = useNotes();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fragment>
      <button
        onClick={()=> navigate(`/note/${note.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full w-full text-xs outline-1 w-full border-b border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-200 dark:bg-gray-600"
      >
        <div className="flex text-left flex-col items-start gap-2">
          <p className={`max-w-full truncate ${!note.content.trim() && "italic"}`}>{note.content.trim() || "(no content)"}</p>
        </div>
      </button>
    </Fragment>
  );
}
