import { useState } from 'react';
import { FiCheck, FiEdit2, FiEdit3, FiFilePlus, FiX } from 'react-icons/fi';

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
      <div className="relative flex flex-row items-center gap-2 bg-white w-72 p-5 py-12 rounded">
        <input
          placeholder="Rename.."
          className="bg-gray-100 px-2 rounded w-full text-xs py-2 outline-none w-[75%]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={() => onRename(text)}
          disabled={!text.trim()}
          className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded disabled:opacity-70"
        >
          Save
        </button>

        <button className="absolute top-2 right-3" onClick={onClose}>
          <FiX />
        </button>
      </div>
    </div>
  );
}
