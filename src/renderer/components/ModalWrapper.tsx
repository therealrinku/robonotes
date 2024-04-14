import { PropsWithChildren } from 'react';
import { FiX } from 'react-icons/fi';

interface Props extends PropsWithChildren {
  onClose: () => void;
}

export default function ModalWrapper({ children, onClose }: Props) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative flex flex-col items-center gap-2 bg-white w-72 py-5 rounded">
        {children}

        <button className="absolute top-2 right-3" onClick={onClose}>
          <FiX />
        </button>
      </div>
    </div>
  );
}
