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
            <span>{rootDir}</span>
          </span>
          <button onClick={handleChangeDir} className="underline">
            Change
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
