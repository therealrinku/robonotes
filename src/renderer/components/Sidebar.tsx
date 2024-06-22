import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  GoDotFill,
  GoDuplicate,
  GoKebabHorizontal,
  GoMoon,
  GoNote,
  GoPencil,
  GoSearch,
  GoSun,
  GoTag,
  GoTools,
  GoTrash,
} from 'react-icons/go';
import PreferencesModal from './PreferencesModal';
import TagsModal from './TagsModal';
import EditNoteModal from './EditNoteModal';
import useTags from '../hooks/useTags';
import useNotes from '../hooks/useNotes';
import useDir from '../hooks/useDir';
import { configs } from '../utils/configs';

interface NoteItemProps {
  noteName: string;
  index: number;
}

export default function Sidebar() {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('color-theme') === 'dark',
  );

  const { notes, handleCreateNewNote } = useNotes();
  const { handleChangeDir } = useDir();
  const { tags } = useTags();

  function handleShortcuts(e: KeyboardEvent) {
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

      // if it has multiple queries, all needs to match aka all or nothing

      const thisNoteTags = Object.entries(tags)
        .filter((tag) => tag[1][noteName] === true)
        .map((tg) => tg[0]);

      return allQueries.every((query) => {
        if (query.startsWith('#')) {
          const tagToMatch = query.slice(1);
          return thisNoteTags.some((tag) => tag === tagToMatch);
        } else {
          return noteName.toLowerCase().includes(query.toLowerCase());
        }
      });
    });
  }, [searchQuery, notes]);

  function toggleTheme() {
    if (isDarkMode) {
      localStorage.setItem('color-theme', 'light');
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      localStorage.setItem('color-theme', 'dark');
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }

  return (
    <Fragment>
      <div className="relative bg-gray-100 dark:bg-[#121212] w-[25%] min-w-[250px] max-w-[500px] min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-2 right-2 flex items-center gap-4">
          <p className="text-xs font-bold self-center">
            robonotes v{configs.version}
          </p>

          <button
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            onClick={toggleTheme}
          >
            {isDarkMode ? <GoSun size={15} /> : <GoMoon size={15} />}
          </button>

          <button
            title="Tags (Ctrl + T)"
            onClick={() => setShowTagsModal(true)}
          >
            <GoTag size={15} />
          </button>

          <button
            title="Preferences (Ctrl + Y)"
            onClick={() => setShowPreferencesModal(true)}
          >
            <GoTools size={15} />
          </button>
        </div>

        <div className="flex flex-row items-center gap-3 w-full px-3">
          <div className=" w-full flex items-center gap-3 justify-between">
            <div className="flex items-center w-full">
              <GoSearch className="absolute ml-2 " color="gray" />
              <input
                title="Search with note name or by tag name, #tagname, note name"
                className="w-full text-xs bg-gray-200 dark:bg-[#404040] p-2 rounded pl-8"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />{' '}
            </div>

            <button
              onClick={handleCreateNewNote}
              className="text-lg flex items-center gap-1"
            >
              <GoDuplicate />
            </button>
          </div>
        </div>

        <div className="w-full pb-5 flex flex-col gap-3 border-gray-200 dark:border-gray-700 border-t overflow-y-auto max-h-[85vh] px-3 pt-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((noteName: string, index) => {
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
    </Fragment>
  );
}

export function NoteItem({ noteName, index }: NoteItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  const { tags } = useTags();
  const {
    handleOpenNote,
    handleRenameNote,
    selectedNoteName,
    handleCloseNote,
  } = useNotes();

  const thisNoteTags = Object.entries(tags).filter(
    (tag) => tag[1][noteName] === true,
  );

  function handleRename(newName: string) {
    handleRenameNote(index, noteName, newName);
    setShowEditNoteModal(false);
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
        className="relative h-full p-2 w-full text-xs bg-gray-200 dark:bg-[#404040] outline-1  w-full rounded"
      >
        <div className="flex flex-row items-center gap-2">
          {selectedNoteName === noteName ? (
            <GoNote color="red" size={13} />
          ) : (
            <GoNote size={13} />
          )}
          <p className={`truncate max-w-[75%]`}>{noteName}</p>

          {thisNoteTags.length > 0 && !isHovered && (
            <p className="flex items-center gap-1 ml-auto">
              <GoTag size={13} /> {thisNoteTags.length}
            </p>
          )}
        </div>

        {isHovered && (
          <div className="absolute top-0 right-0 h-full flex flex-row items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditNoteModal(true);
              }}
              className="h-full px-2"
            >
              <GoKebabHorizontal size={14} />
            </button>
          </div>
        )}
      </button>

      {showEditNoteModal && (
        <EditNoteModal
          onClose={() => setShowEditNoteModal(false)}
          initialText={noteName}
          onRename={handleRename}
          noteName={noteName}
        />
      )}
    </Fragment>
  );
}
