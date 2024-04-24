import { GoFileDirectory, GoMoon, GoSun } from 'react-icons/go';
import ModalWrapper from './ModalWrapper';
import useDir from '../hooks/useDir';
import useTheme from '../hooks/useTheme';

interface Props {
  onClose: () => void;
  handleChangeDir: () => void;
}

export default function PreferencesModal({ onClose, handleChangeDir }: Props) {
  const { rootDir } = useDir();
  const { theme, toggleTheme } = useTheme();

  return (
    <ModalWrapper title="Preferences" onClose={onClose}>
      <div className="text-xs flex flex-col gap-5">
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

        <div className="flex flex-col items-start gap-2">
          <b>Theme</b>

          <div className="flex items-start gap-5">
            <button
              disabled={theme === 'dark'}
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              <GoMoon size={18} />
              <span className={theme === 'dark' ? 'font-bold' : ''}>Dark</span>
            </button>
            <button
              disabled={theme === 'light'}
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              <GoSun size={18} />
              <span className={theme === 'light' ? 'font-bold' : ''}>
                Light
              </span>
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
