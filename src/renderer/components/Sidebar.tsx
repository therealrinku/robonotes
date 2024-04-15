import { Fragment, useMemo, useState } from 'react';
import {
  GoFile,
  GoGear,
  GoItalic,
  GoPencil,
  GoPlusCircle,
  GoSearch,
  GoTag,
  GoTrash,
} from 'react-icons/go';
import useRootContext from '../hooks/useRootContext';
import PreferencesModal from './PreferencesModal';
import TagsModal from './TagsModal';
import EditNoteModal from './EditNoteModal';

interface NoteItemProps {
  fileName: string;
  index: number;
}

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const [searchBy, setSearchBy] = useState('name');

  const { rootDir, setRootDir, notes, setNotes, tags, setSelectedNoteIndex } =
    useRootContext();

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
      const allSearchTags = searchQuery
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (searchBy === 'name') {
        //@ts-ignore

        return fileName.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (allSearchTags.length > 0 && searchBy === 'tag') {
        const thisNoteTags = Object.entries(tags).filter(
          //@ts-ignore
          (tag) => tag[1][fileName] === true,
        );

        return thisNoteTags.some((tag) => allSearchTags.includes(tag[0]));
      } else {
        return true;
      }
    });
  }, [searchQuery, notes, searchBy]);

  return (
    <Fragment>
      <div className="relative bg-gray-100 min-w-64 max-w-64 min-h-screen flex flex-col items-center gap-5 py-5">
        <div className="absolute bottom-3 text-xs w-full px-3 flex flex-row items-center justify-center gap-2">
          <p className="truncate max-w-[85%]">robunot v.0.0.0</p>
          <button onClick={() => setShowPreferencesModal(true)}>
            <GoGear />
          </button>
        </div>

        <div className="px-3 flex flex-row items-center gap-3">
          <div className="relative w-full">
            <GoSearch
              className="absolute left-2 top-2"
              color="gray"
              size={13}
            />
            <input
              placeholder={
                searchBy === 'name' ? 'Search by note name...' : 'tag1, tag2'
              }
              className="bg-gray-200 px-7 rounded w-full text-xs py-1 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchBy === 'name' ? (
              <GoTag
                onClick={() => setSearchBy('tag')}
                className="absolute top-2 right-2"
                size={13}
              />
            ) : (
              <GoItalic
                onClick={() => setSearchBy('name')}
                className="absolute top-2 right-2"
                size={13}
              />
            )}
          </div>

          <div className="flex flex-row items-center gap-3">
            <button onClick={handleCreateNewNote} className="py-2">
              <GoPlusCircle />
            </button>

            <button onClick={() => setShowTagsModal(true)} className="py-2">
              <GoTag />
            </button>
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
                onClick={handleSelectFolder}
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
          handleChangeDir={handleSelectFolder}
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

  const {
    tags,
    rootDir,
    notes,
    selectedNoteIndex,
    setSelectedNoteIndex,
    setNotes,
  } = useRootContext();

  function handleRename(newName: string) {
    //@ts-ignore
    if (notes.includes(newName)) {
      alert('Note with same name already exists!');
      return;
    }

    window.electron.ipcRenderer.sendMessage(
      'rename-note',
      rootDir,
      fileName,
      newName,
    );

    const updatedNotes = [...notes];
    //@ts-ignore
    updatedNotes[selectedNoteIndex] = newName;
    //@ts-ignore
    setNotes(updatedNotes);
    setShowRenameModal(false);
  }

  function handleDelete() {
    const confirmed = confirm('Are you sure to delete this note ? ');

    if (!confirmed) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('delete-note', rootDir, fileName);

    //@ts-ignore
    setNotes((prev) => prev.filter((item) => item !== fileName));
    setSelectedNoteIndex(-1);
  }

  const thisNoteTags = Object.entries(tags).filter(
    //@ts-ignore
    (tag) => tag[1][fileName] === true,
  );

  return (
    <Fragment>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSelectedNoteIndex(index)}
        className={`${selectedNoteIndex === index && 'outline-dashed outline-green-500'} relative h-full p-2 w-full text-xs bg-gray-200 hover:outline-dashed outline-1  w-full rounded`}
      >
        <div className="flex flex-row items-center gap-1">
          <GoFile />
          <p
            className={`truncate ${isHovered ? 'max-w-[70%]' : 'max-w-[85%]'}`}
          >
            {fileName}
          </p>
          &middot;
          <p className="flex items-center gap-1">
            <GoTag /> {thisNoteTags.length}
          </p>
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
