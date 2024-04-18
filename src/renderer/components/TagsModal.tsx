import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import useTags from '../hooks/useTags';
import { GoTrash } from 'react-icons/go';

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
      <div className="flex flex-row flex-wrap self-start gap-2 max-h-[150px] overflow-y-auto">
        {tagNames.map((tagName) => {
          return <Tag tagName={tagName} key={tagName} />;
        })}
      </div>

      <div className="mt-10 flex flex-row items-center gap-2">
        <input
          placeholder="New Tag.. (3-20 length)"
          className="bg-gray-100 px-2 rounded w-full text-xs py-2 outline-none focus:outline focus:outline-1 focus:outline-green-500 w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAddTag}
          disabled={!text.trim() || text.length < 3 || text.length > 20}
          className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded disabled:opacity-70"
        >
          Add
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
      className="relative text-xs bg-gray-100 text-center p-2 w-24 rounded disabled:opacity-70"
    >
      <p>{tagName}</p>

      {isHovered && (
        <button
          onClick={handleDeleteTag}
          className="absolute top-0 left-0 h-full w-full bg-gray-100 flex items-center justify-center rounded"
        >
          <GoTrash color="red" />
        </button>
      )}
    </div>
  );
}
