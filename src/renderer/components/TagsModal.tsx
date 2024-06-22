import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import useTags from '../hooks/useTags';
import { GoPlus, GoTag, GoTrash } from 'react-icons/go';

interface Props {
  onClose: () => void;
}

export default function TagsModal({ onClose }: Props) {
  const { tags, addTag } = useTags();

  const tagNames = Object.keys(tags);

  const [text, setText] = useState('');

  function handleAddTag() {
    if (tagNames.includes(text)) {
      alert('Tag already exists!');
      return;
    }

    addTag(text);
    setText('');
  }

  return (
    <ModalWrapper title="Tags Center" onClose={onClose}>
      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto px-5 pt-5">
        {tagNames.map((tagName) => {
          return <Tag tagName={tagName} key={tagName} />;
        })}
      </div>

      <div className="mt-7 flex flex-row items-center gap-2 px-5 pb-5">
        <input
          placeholder="Add New Tag"
          className="bg-gray-100 dark:bg-[#121212] px-2 rounded w-full text-xs py-2 outline-none focus:outline focus:outline-1 focus:outline-green-500 w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAddTag}
          disabled={!text.trim() || text.length < 3 || text.length > 20}
          className="border px-2 py-[7px] rounded-md"
        >
          <GoPlus />
        </button>
      </div>
    </ModalWrapper>
  );
}

function Tag({ tagName }: { tagName: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const { removeTag } = useTags();

  function handleDeleteTag() {
    removeTag(tagName);
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative text-xs bg-gray-100 dark:bg-[#121212] text-center p-2 w-full rounded disabled:opacity-70"
    >
      <p>{tagName}</p>

      {isHovered && (
        <button
          onClick={handleDeleteTag}
          className="absolute top-0 left-0 h-full w-full bg-gray-100 dark:bg-[#121212] flex items-center justify-center rounded"
        >
          <GoTrash color="red" />
        </button>
      )}
    </div>
  );
}
