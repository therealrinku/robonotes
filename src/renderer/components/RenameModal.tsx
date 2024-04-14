import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Props {
  onClose: () => void;
  initialText: string;
  onRename: Function;
}

export default function RenameModal({ onClose, initialText, onRename }: Props) {
  const [text, setText] = useState(initialText || '');

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative flex flex-col gap-5 bg-white p-5 rounded">
        <input
          placeholder="Search..."
          className="bg-gray-100 px-2 rounded w-full text-xs py-2 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => onRename(text)}
          disabled={!text.trim()}
          className="flex items-center self-start text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded disabled:opacity-70"
        >
          <p>Rename</p>
        </button>

        <button className="absolute top-1 right-2" onClick={onClose}>
          <FiX />
        </button>
      </div>
    </div>
  );
}
