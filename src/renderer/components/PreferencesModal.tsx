import useRootContext from '../hooks/useRootContext';
import ModalWrapper from './ModalWrapper';

interface Props {
  onClose: () => void;
  handleChangeDir: () => void;
}

export default function PreferencesModal({ onClose, handleChangeDir }: Props) {
  const { rootDir } = useRootContext();

  return (
    <ModalWrapper onClose={onClose}>
      <p className="text-sm font-bold">Preferences</p>

      <div className="text-xs mt-5 flex flex-col items-center gap-5">
        <p className="px-5">Root Directory: {rootDir}</p>
        <button
          onClick={handleChangeDir}
          className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded"
        >
          <p>Change Directory</p>
        </button>
      </div>
    </ModalWrapper>
  );
}
