import { useState } from 'react';
import ModalWrapper from './ModalWrapper';

interface Props {
  onClose: () => void;
}

export default function TagsModal({ onClose }: Props) {
  const [text, setText] = useState('');

  return (
    <ModalWrapper onClose={onClose}>
      <p className="text-xs font-bold">Tags</p>

      <div className="flex flex-row flex-wrap mx-5 gap-2 mt-5">
        {new Array(5).fill(0).map((_, index) => {
          return (
            <div
              key={index}
              className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded disabled:opacity-70"
            >
              Tag
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-row items-center gap-2">
        <input
          placeholder="New Tag.."
          className="bg-gray-100 px-2 rounded w-full text-xs py-2 outline-none w-[75%]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          //   onClick={() => onRename(text)}
          disabled={!text.trim()}
          className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded disabled:opacity-70"
        >
          Add
        </button>
      </div>
    </ModalWrapper>
  );
}
