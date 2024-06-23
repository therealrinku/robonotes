import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import useTags from '../hooks/useTags';
import { GoNote, GoPencil, GoPlus, GoTag, GoTrash } from 'react-icons/go';
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
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  const { tags, addTagToNote, removeTagFromNote } = useTags();
  const { handleDeleteNote } = useNotes();

  function handleAddTag(tagName: string) {
    addTagToNote(noteName, tagName);
    setShowTagsDropdown(false);
  }

  const thisNoteTags = Object.entries(tags).filter(
    (tag) => tag[1][noteName] === true,
  );

  const allTagNames = Object.keys(tags).filter((tg) =>
    thisNoteTags.every((tn) => tn[0] !== tg),
  );

  return (
    <ModalWrapper title="Edit Note" onClose={onClose}>
      <div className="flex flex-col self-start w-full gap-3 px-5 py-5">
        <div className="flex items-center relative">
          <GoNote size={13} color="gray" className="absolute left-2" />
          <input
            placeholder="Rename.."
            className="bg-gray-100 dark:bg-[#121212] px-8 pr-16 rounded w-full text-xs py-2 outline-none focus:outline focus:outline-1 focus:outline-blue-500 w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => onRename(text)}
            disabled={!text.trim()}
            className="absolute right-7 border-l dark:border-gray-700 h-full px-2"
          >
            <GoPencil size={13} />
          </button>
          <button
            onClick={() => {
              handleDeleteNote(noteName);
            }}
            className="absolute right-0 border-l dark:border-gray-700 h-full px-2 text-red-500"
          >
            <GoTrash size={13} />
          </button>
        </div>
      </div>

      <div className="self-start my-5">
        <div className="relative flex flex-row items-center gap-2 px-5">
          <p className="text-xs">
            Tags {thisNoteTags.length > 0 ? `(${thisNoteTags.length})` : ''}{' '}
          </p>

          {allTagNames.length > 0 && (
            <button onClick={() => setShowTagsDropdown((prev) => !prev)}>
              <GoPlus />
            </button>
          )}

          {showTagsDropdown && (
            <div className="shadow-lg max-h-[100px] overflow-y-auto py-1 flex-col rounded-md w-24 top-5 bg-gray-100 dark:bg-[#121212] text-xs absolute z-50 border dark:border-gray-700">
              {allTagNames.map((tag) => {
                return (
                  <button
                    onClick={() => handleAddTag(tag)}
                    key={tag}
                    value={tag}
                    className="hover:bg-gray-200 dark:bg-[#121212] w-full py-[7px] text-left pl-5"
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col mt-4 gap-2 h-[100px] overflow-y-auto px-5">
          {thisNoteTags.length > 0 ? (
            thisNoteTags.map((tag) => {
              return (
                <TagItem
                  tagName={tag[0]}
                  removeTagFromNote={removeTagFromNote}
                  noteName={noteName}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center w-full justify-center gap-3 text-xs h-full">
              <GoTag size={20} />
              <p>No any tags added yet.</p>
            </div>
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
      className="relative flex items-center gap-3 text-xs bg-gray-100 dark:bg-[#121212] py-2 px-5 rounded disabled:opacity-70"
    >
      <GoTag />
      {tagName}

      {isHovered && (
        <button
          onClick={() => handleDeleteTag(tagName)}
          className="absolute top-0 left-0 flex justify-center items-center rounded h-full w-full bg-gray-200 dark:bg-[#121212]"
        >
          <GoTrash color="red" />
        </button>
      )}
    </div>
  );
}
