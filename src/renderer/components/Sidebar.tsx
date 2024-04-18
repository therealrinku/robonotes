import { Fragment, useMemo, useState } from 'react';
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

interface NoteItemProps {
  fileName: string;
  index: number;
}

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const { tags } = useTags();
  const { notes, handleCreateNewNote } = useNotes();
  const { handleChangeDir } = useDir();

  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes) || notes.length == 0) {
      return [];
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

  return (
    <Fragment>
      <div className="relative bg-gray-100 min-w-64 max-w-64 min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-3 text-xs w-full px-3 flex flex-row items-center justify-end gap-5">
          <button onClick={handleCreateNewNote}>
            <GoPlusCircle size={15} />
          </button>

          <button onClick={() => setShowTagsModal(true)}>
            <GoTag size={15} />
          </button>

          <button onClick={() => setShowPreferencesModal(true)}>
            <GoGear size={15} />
          </button>
        </div>

        <div className="flex flex-row items-center gap-3 w-full px-3">
          <div className="relative w-full">
            <GoSearch
              className="absolute left-2 h-full"
              color="gray"
              size={13}
            />
            <input
              placeholder="my secret note, #dev, #devrel"
              className="bg-gray-200 pl-7 pr-3 rounded w-full text-xs py-2 outline-none focus:outline focus:outline-1 focus:outline-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full pb-5 flex flex-col gap-2 border-white border-t pt-5 overflow-y-auto max-h-[85vh] px-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((fileName: string, index) => {
              return (
                <NoteItem key={fileName} fileName={fileName} index={index} />
              );
            })
          ) : notes.length === 0 ? (
            <div className="text-xs text-center h-[70vh] flex flex-col items-center justify-center">
              <p>No notes found.</p>
              <button
                onClick={handleChangeDir}
                className="mt-5 text-xs bg-gray-200 py-2 px-5 rounded"
              >
                Change directory
              </button>
              <button
                onClick={handleCreateNewNote}
                className="mt-5 text-xs bg-gray-200 py-2 px-5 rounded"
              >
                Create new note
              </button>
            </div>
          ) : (
            <div className="text-xs text-center">
              <p>No notes found.</p>
            </div>
          )}
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

function NoteItem({ fileName, index }: NoteItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const { tags } = useTags();
  const {
    handleOpenNote,
    handleRenameNote,
    handleDeleteNote,
    selectedNoteName,
  } = useNotes();

  const thisNoteTags = Object.entries(tags).filter(
    (tag) => tag[1][fileName] === true,
  );

  function handleRename(newName: string) {
    handleRenameNote(index, fileName, newName);
    setShowRenameModal(false);
  }

  function handleDelete() {
    handleDeleteNote(fileName);
  }

  return (
    <Fragment>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleOpenNote(index)}
        className={`${selectedNoteName === fileName && 'outline-dashed outline-green-500'} relative h-full p-2 w-full text-xs bg-gray-200 outline-1  w-full rounded`}
      >
        <div className="flex flex-row items-center gap-1">
          <GoFile size={13} />
          <p
            className={`truncate ${isHovered ? 'max-w-[70%]' : 'max-w-[85%]'}`}
          >
            {fileName}
          </p>

          {thisNoteTags.length > 0 && (
            <p className="flex items-center gap-1">
              &middot;
              <GoTag size={13} /> {thisNoteTags.length}
            </p>
          )}
        </div>

        {isHovered && (
          <div className="absolute top-0 right-0 h-full flex flex-row items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameModal(true);
              }}
              className="h-full px-2"
            >
              <GoPencil size={14} />
            </button>
            <button
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
          initialText={fileName}
          onRename={handleRename}
          fileName={fileName}
        />
      )}
    </Fragment>
  );
}
