import { PropsWithChildren, useEffect } from 'react';
import { GoX } from 'react-icons/go';

interface Props extends PropsWithChildren {
  title: string;
  onClose: () => void;
}

export default function ModalWrapper({ title, children, onClose }: Props) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
    >
      <div className="flex flex-col items-center gap-2 bg-white dark:bg-[#252526] w-72 rounded">
        <div className="flex flex-row items-center justify-between bg-gray-100 dark:bg-[#121212] w-full h-10 px-3 rounded-tl rounded-tr">
          <p className="text-sm font-bold">{title}</p>

          <button onClick={onClose}>
            <GoX size={20} />
          </button>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
