import { GoFileDirectory } from 'react-icons/go';
import ModalWrapper from './ModalWrapper';
import useDir from '../hooks/useDir';

interface Props {
  onClose: () => void;
  handleChangeDir: () => void;
}

export default function PreferencesModal({ onClose, handleChangeDir }: Props) {
  const { rootDir } = useDir();

  return (
    <ModalWrapper title="Preferences" onClose={onClose}>
      <div className="text-xs flex flex-col gap-5 p-5">
        <div className="flex flex-col items-start gap-2">
          <p>
            <b>Root Directory</b>
          </p>

          <span className="flex items-center gap-2">
            <GoFileDirectory size={18} />
            <span className="break-all">{rootDir}</span>
          </span>

          <button
            onClick={handleChangeDir}
            className="p-2 w-full rounded-md mt-5 bg-gray-100 hover:bg-gray-200 dark:bg-[#121212] dark:hover:bg-[#121212]"
          >
            Change
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
