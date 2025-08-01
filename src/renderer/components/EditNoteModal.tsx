import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { GoNote, GoPencil, GoTag, GoTrash } from 'react-icons/go';

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
}: Props) {
  const [text, setText] = useState(initialText || '');
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
            title="Rename Note"
            onClick={() => onRename(text)}
            disabled={!text.trim()}
            className="absolute right-7 border-l dark:border-gray-700 h-full px-2"
          >
            <GoPencil size={13} />
          </button>
          <button
            title="Delete Note"
            onClick={() => { }}
            className="absolute right-0 border-l dark:border-gray-700 h-full px-2 text-red-500"
          >
            <GoTrash size={13} />
          </button>
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
