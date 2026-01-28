import { useMemo } from 'react';
import {
  GoBold,
  GoTag,
  GoTypography,
  GoTrash,
  GoPlus,
  GoX,
} from 'react-icons/go';
import useNotes from '../hooks/useNotes';

export default function Toolbar() {
  const { handleCreateNewNote, handleDeleteNote, handleCloseNote, openNote } =
    useNotes();

  const charCount = openNote?.content?.length || 0;

  const wordCount = useMemo(
    () =>
      openNote?.content?.split(/\s+/).filter((word) => word !== '').length || 0,
    [openNote?.content],
  );
  const tagsCount = useMemo(
    () =>
      openNote?.content?.split(/\s+|\n+/).filter((word) => word.startsWith('#'))
        .length || 0,
    [openNote?.content],
  );

  if (!openNote) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center text-xs">
          <div className="flex items-center bg-gray-100 dark:bg-[#1e1e1e] dark:text-white h-7">
            <div
              className="flex items-center gap-2 px-3 border-r dark:border-gray-700 h-full"
              title="Total number of characters"
            >
              <span className="font-bold">
                {new Intl.NumberFormat('en-US').format(charCount)}
              </span>{' '}
              <GoBold />
            </div>
            <div
              className="flex items-center gap-2 px-3 dark:border-gray-700 h-full"
              title="Total number of words"
            >
              <span className="font-bold">
                {new Intl.NumberFormat('en-US').format(wordCount)}
              </span>{' '}
              <GoTypography />
            </div>

            <div
              className="flex items-center gap-2 px-3 border-l dark:border-gray-700 h-full"
              title="Total number of tags"
            >
              <span className="font-bold">
                {new Intl.NumberFormat('en-US').format(tagsCount)}
              </span>{' '}
              <GoTag />
            </div>

            <button
              title="Close this note"
              onClick={handleCloseNote}
              className="px-3 h-full dark:border-gray-700 border-l"
            >
              <GoX size={13} />
            </button>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-[#1e1e1e] dark:text-white h-7 mx-5">
            <button
              title="Add new note"
              onClick={handleCreateNewNote}
              className="px-3 border-l h-full dark:border-gray-700 hover:bg-green-900"
            >
              <GoPlus size={14} />
            </button>

            <button
              title="Delete this note"
              onClick={() => handleDeleteNote(openNote.id)}
              className="px-3 hover:bg-red-900 h-full dark:border-gray-700 border-l"
            >
              <GoTrash size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
