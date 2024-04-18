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
      <div className="text-xs flex flex-col items-center gap-5">
        <p className="flex items-start gap-2">
          <GoFileDirectory size={16} /> Root Directory: {rootDir}
        </p>

        <button
          onClick={handleChangeDir}
          className="flex items-center text-xs bg-gray-200 hover:bg-gray-200 py-2 px-5 rounded"
        >
          <p>Change Directory</p>
        </button>
      </div>
    </ModalWrapper>
  );
}
