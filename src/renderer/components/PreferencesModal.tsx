import { GoFileDirectory, GoMoon, GoSun } from 'react-icons/go';
import ModalWrapper from './ModalWrapper';
import useDir from '../hooks/useDir';
import { useState } from 'react';

interface Props {
  onClose: () => void;
  handleChangeDir: () => void;
}

export default function PreferencesModal({ onClose, handleChangeDir }: Props) {
  const { rootDir } = useDir();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('color-theme') === 'dark',
  );

  function toggleTheme() {
    if (isDarkMode) {
      localStorage.setItem('color-theme', 'light');
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      localStorage.setItem('color-theme', 'dark');
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }

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
            <button onClick={toggleTheme} className="flex items-center gap-2">
              <GoMoon size={18} />
              <span className={isDarkMode ? 'font-bold' : ''}>Dark</span>
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-2">
              <GoSun size={18} />
              <span className={!isDarkMode ? 'font-bold' : ''}>Light</span>
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
