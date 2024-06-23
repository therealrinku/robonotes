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
    if (!text.trim() || text.length < 3 || text.length > 20) {
      return;
    }

    if (tagNames.includes(text)) {
      alert('Tag already exists!');
      return;
    }

    addTag(text);
    setText('');
  }

  return (
    <ModalWrapper title="Manage Tags" onClose={onClose}>
      <div className="pt-5 px-5">
        <div className="relative flex items-center w-full h-8">
          <GoTag className="absolute left-2 h-full" color="gray" size={13} />
          <input
            placeholder="Add New Tag"
            className="bg-gray-100 dark:bg-[#121212] pl-8 pr-2 rounded w-full text-xs h-full outline-none focus:outline focus:outline-1 focus:outline-blue-500 w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <button
            onClick={handleAddTag}
            disabled={!text.trim() || text.length < 3 || text.length > 20}
            className="absolute right-0 border-l h-full px-2"
          >
            <GoPlus />
          </button>
        </div>
      </div>

      <div className="h-[180px]  overflow-y-auto px-5 pt-10 mb-5">
        {tagNames.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tagNames.map((tagName) => {
              return <Tag tagName={tagName} key={tagName} />;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-xs h-full">
            <GoTag size={20} />
            <p>No any tags found.</p>
          </div>
        )}
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
      className="flex items-center self-start gap-3 relative text-xs bg-gray-100 dark:bg-[#121212] text-center py-2 px-3  rounded disabled:opacity-70"
    >
      <GoTag />
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
