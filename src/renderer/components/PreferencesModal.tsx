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
      <div className="text-xs flex flex-col gap-5">
        <p className="flex items-start gap-2">
          <GoFileDirectory size={18} />
          <span>
            Root Directory: <b>{rootDir}</b>
          </span>
        </p>

        <button
          onClick={handleChangeDir}
          className="flex items-center justify-center text-xs bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
        >
          <p>Change Root Directory</p>
        </button>
      </div>
    </ModalWrapper>
  );
}
