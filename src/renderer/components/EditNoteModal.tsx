import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import useTags from '../hooks/useTags';
import { GoTrash } from 'react-icons/go';

interface Props {
  onClose: () => void;
  initialText: string;
  onRename: Function;
  fileName: string;
}

export default function EditNoteModal({
  onClose,
  initialText,
  onRename,
  fileName,
}: Props) {
  const [text, setText] = useState(initialText || '');
  const { tags, addTagToNote, removeTagFromNote } = useTags();

  function handleAddTag(tagName: string) {
    addTagToNote(fileName, tagName);
  }

  const thisNoteTags = Object.entries(tags).filter(
    //@ts-ignore
    (tag) => tag[1][fileName] === true,
  );

  const allTagNames = Object.keys(tags).filter((tg) =>
    thisNoteTags.every((tn) => tn[0] !== tg),
  );

  return (
    <ModalWrapper title="Edit Note" onClose={onClose}>
      <div className="flex flex-row items-center gap-3 self-start">
        <input
          placeholder="Rename.."
          className="bg-gray-100 px-2 rounded w-full text-xs py-2 outline-none w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => onRename(text)}
          disabled={!text.trim()}
          className="text-xs bg-gray-100 hover:bg-gray-300 py-2 px-5 rounded disabled:opacity-70"
        >
          Rename
        </button>
      </div>

      <div className="self-start mt-10">
        <p className="text-sm font-bold">Tags</p>

        <div className="flex flex-row flex-wrap items-center mt-2 gap-2 max-h-[150px] overflow-y-auto ">
          {thisNoteTags.map((tag) => {
            return (
              <TagItem
                tagName={tag[0]}
                removeTagFromNote={removeTagFromNote}
                fileName={fileName}
              />
            );
          })}

          {allTagNames.length > 0 && (
            <select
              onChange={(e) => {
                handleAddTag(e.target.value);
                e.target.selectedIndex = 0;
              }}
              className="text-xs py-2 pl-5 pr-7 outline-none rounded"
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
  fileName: string;
  removeTagFromNote: any;
  tagName: string;
}

function TagItem({ fileName, removeTagFromNote, tagName }: TagItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  function handleDeleteTag(tagName: string) {
    removeTagFromNote(fileName, tagName);
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative text-xs bg-gray-200 py-2 px-5 rounded disabled:opacity-70"
    >
      {tagName}

      {isHovered && (
        <button
          onClick={() => handleDeleteTag(tagName)}
          className="absolute top-0 left-0 flex justify-center items-center rounded h-full w-full bg-gray-200"
        >
          <GoTrash />
        </button>
      )}
    </div>
  );
}
