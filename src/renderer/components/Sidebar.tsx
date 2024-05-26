import { Fragment, useEffect, useState } from 'react';
import {
  GoFile,
  GoGear,
  GoPencil,
  GoPlusCircle,
  GoSearch,
  GoTag,
  GoTrash,
} from 'react-icons/go';
import PreferencesModal from './PreferencesModal';
import TagsModal from './TagsModal';
import EditNoteModal from './EditNoteModal';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';
import useDir from '../hooks/useDir';
import SearchPopup from './SearchPopup';
import { configs } from '../utils/configs';

interface NoteItemProps {
  noteName: string;
  index: number;
}

export default function Sidebar() {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  const { notes, handleCreateNewNote } = useNotes();
  const { handleChangeDir } = useDir();

  function handleShortcuts(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'p') {
      setShowSearchPopup(true);
    }

    // if (e.ctrlKey && e.key === 'n') {
    //   handleCreateNewNote();
    // }
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('open-preferences', () => {
      setShowPreferencesModal(true);
    });

    window.electron.ipcRenderer.on('open-tags-modal', () => {
      setShowTagsModal(true);
    });

    window.electron.ipcRenderer.on('open-search', () => {
      setShowSearchPopup(true);
    });

    document.addEventListener('keydown', handleShortcuts);

    return () => document.removeEventListener('keydown', handleShortcuts);
  }, []);

  return (
    <Fragment>
      <div className="relative bg-gray-100 dark:bg-[#121212] min-w-64 max-w-64 min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="flex flex-row items-center gap-3 w-full px-3">
          <div className=" w-full flex items-center gap-3 justify-between">
            <p className="text-xs font-bold">robonotes v{configs.version}</p>

            <div className="flex items-center gap-3">
              <button
                title="Quick search (Ctrl + P)"
                onClick={() => setShowSearchPopup(true)}
              >
                <GoSearch size={15} />
              </button>

              <button title="Add new note" onClick={handleCreateNewNote}>
                <GoPlusCircle size={15} />
              </button>

              <button
                title="Manage tags (Ctrl + T)"
                onClick={() => setShowTagsModal(true)}
              >
                <GoTag size={15} />
              </button>

              <button
                title="Preferences (Ctrl + Y)"
                onClick={() => setShowPreferencesModal(true)}
              >
                <GoGear size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full pb-5 flex flex-col gap-2 border-white border-t pt-5 overflow-y-auto max-h-[85vh] px-3">
          {notes.length > 0 ? (
            notes.map((noteName: string, index) => {
              return (
                <NoteItem key={noteName} noteName={noteName} index={index} />
              );
            })
          ) : notes.length === 0 ? (
            <div className="text-xs text-center h-[70vh] flex flex-col items-center justify-center">
              <p>No notes found.</p>
              <button
                onClick={handleChangeDir}
                className="mt-5 text-xs bg-gray-200 dark:bg-[#404040] py-2 px-5 rounded"
              >
                Change directory
              </button>
              <button
                onClick={handleCreateNewNote}
                className="mt-5 text-xs bg-gray-200 dark:bg-[#404040] py-2 px-5 rounded"
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

      {showTagsModal && <TagsModal onClose={() => setShowTagsModal(false)} />}

      {showSearchPopup && (
        <SearchPopup onClose={() => setShowSearchPopup(false)} />
      )}
    </Fragment>
  );
}

export function NoteItem({ noteName, index }: NoteItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const { tags } = useTags();
  const {
    handleOpenNote,
    handleRenameNote,
    handleDeleteNote,
    selectedNoteName,
    handleCloseNote,
  } = useNotes();

  const thisNoteTags = Object.entries(tags).filter(
    (tag) => tag[1][noteName] === true,
  );

  function handleRename(newName: string) {
    handleRenameNote(index, noteName, newName);
    setShowRenameModal(false);
  }

  function handleDelete() {
    handleDeleteNote(noteName);
  }

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClickNoteItem}
        className={`${selectedNoteName === noteName && 'outline-dashed outline-green-500'} relative h-full p-2 w-full text-xs bg-gray-200 dark:bg-[#404040] outline-1  w-full rounded`}
      >
        <div className="flex flex-row items-center gap-2">
          <GoFile size={13} />
          <p
            className={`truncate ${isHovered ? 'max-w-[65%]' : 'max-w-[75%]'}`}
          >
            {noteName}
          </p>

          {thisNoteTags.length > 0 && !isHovered && (
            <p className="flex items-center gap-1 ml-auto">
              <GoTag size={13} /> {thisNoteTags.length}
            </p>
          )}
        </div>

        {isHovered && (
          <div className="absolute top-0 right-0 h-full flex flex-row items-center">
            <button
              title="Edit title & tags"
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameModal(true);
              }}
              className="h-full px-2"
            >
              <GoPencil size={14} />
            </button>
            <button
              title="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="h-full px-2"
            >
              <GoTrash size={14} color="red" />
            </button>
          </div>
        )}
      </button>

      {showRenameModal && (
        <EditNoteModal
          onClose={() => setShowRenameModal(false)}
          initialText={noteName}
          onRename={handleRename}
          fileName={noteName}
        />
      )}
    </Fragment>
  );
}
