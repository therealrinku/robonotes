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
    <ModalWrapper onClose={onClose}>
      <p className="text-sm font-bold">Preferences</p>

      <div className="text-xs mt-5 flex flex-col items-center gap-5">
        <p className="px-5 flex items-start gap-2">
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
