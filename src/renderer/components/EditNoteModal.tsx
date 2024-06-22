import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import useTags from '../hooks/useTags';
import { GoTrash } from 'react-icons/go';
import useNotes from '../hooks/useNotes';

interface Props {
  onClose: () => void;
  initialText: string;
  onRename: Function;
  noteName: string;
}

export default function EditNoteModal({
  onClose,
  initialText,
  onRename,
  noteName,
}: Props) {
  const [text, setText] = useState(initialText || '');
  const { tags, addTagToNote, removeTagFromNote } = useTags();
  const { handleDeleteNote } = useNotes();

  function handleAddTag(tagName: string) {
    addTagToNote(noteName, tagName);
  }

  const thisNoteTags = Object.entries(tags).filter(
    (tag) => tag[1][noteName] === true,
  );

  const allTagNames = Object.keys(tags).filter((tg) =>
    thisNoteTags.every((tn) => tn[0] !== tg),
  );

  return (
    <ModalWrapper title="Edit Note" onClose={onClose}>
      <div className="flex flex-col self-start w-full gap-3">
        <input
          placeholder="Rename.."
          className="bg-gray-100 dark:bg-[#121212] px-2 rounded w-full text-xs py-2 outline-none focus:outline focus:outline-1 focus:outline-green-500 w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-row gap-3">
          <button
            onClick={() => onRename(text)}
            disabled={!text.trim()}
            className="text-xs bg-gray-100 dark:bg-[#121212] hover:bg-gray-300 py-2 px-5 rounded disabled:opacity-70"
          >
            Rename
          </button>

          <button
            onClick={() => {
              handleDeleteNote(noteName);
            }}
            className="text-xs bg-red-500 px-5 py-2 rounded-md text-white"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="self-start mt-10">
        <p className="text-sm font-bold">
          Tags {thisNoteTags.length > 0 ? `(${thisNoteTags.length})` : ''}
        </p>

        {thisNoteTags.length > 0 && (
          <div className="flex flex-row flex-wrap items-center mt-2 mt-3 gap-2 max-h-[180px] overflow-y-auto ">
            {thisNoteTags.map((tag) => {
              return (
                <TagItem
                  tagName={tag[0]}
                  removeTagFromNote={removeTagFromNote}
                  noteName={noteName}
                />
              );
            })}
          </div>
        )}

        <div className="mt-2">
          {allTagNames.length > 0 && (
            <select
              onChange={(e) => {
                handleAddTag(e.target.value);
                e.target.selectedIndex = 0;
              }}
              className="text-xs py-2 w-32 pl-4 outline-none rounded bg-gray-100 dark:bg-[#121212] "
              defaultValue={'new'}
            >
              <option
                className="truncate max-w-[85%]"
                disabled
                selected
                value={'new'}
              >
                Add new tag
              </option>

              {allTagNames.map((tag) => {
                return (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

interface TagItemProps {
  noteName: string;
  removeTagFromNote: any;
  tagName: string;
}

function TagItem({ noteName, removeTagFromNote, tagName }: TagItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  function handleDeleteTag(tagName: string) {
    removeTagFromNote(noteName, tagName);
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative text-xs bg-gray-100 dark:bg-[#121212] py-2 px-5 rounded disabled:opacity-70"
    >
      {tagName}

      {isHovered && (
        <button
          onClick={() => handleDeleteTag(tagName)}
          className="absolute top-0 left-0 flex justify-center items-center rounded h-full w-full bg-gray-200 dark:bg-[#404040]"
        >
          <GoTrash />
        </button>
      )}
    </div>
  );
}
