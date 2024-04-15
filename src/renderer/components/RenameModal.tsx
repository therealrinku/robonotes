import { useState } from 'react';
import { FiCheck, FiEdit2, FiEdit3, FiFilePlus, FiX } from 'react-icons/fi';
import ModalWrapper from './ModalWrapper';

interface Props {
  onClose: () => void;
  initialText: string;
  onRename: Function;
}

export default function RenameModal({ onClose, initialText, onRename }: Props) {
  const [text, setText] = useState(initialText || '');

  return (
    <ModalWrapper onClose={onClose}>
      <div className="mt-5 flex flex-row items-center gap-2">
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
      </div>
    </ModalWrapper>
  );
}
