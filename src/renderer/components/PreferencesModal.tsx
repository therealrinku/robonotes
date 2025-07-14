import ModalWrapper from './ModalWrapper';
import useDir from '../hooks/useDir';
import { useState, useEffect } from "react";
import { GoMoon, GoSun, GoFileDirectory } from 'react-icons/go';
import { configs } from '../utils/configs';

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

  useEffect(()=>{
    window.electron.ipcRenderer.on('toggle-theme', () => {
      toggleTheme();
    });
  },[])

  return (
    <ModalWrapper title={`v${configs.version} Preferences`} onClose={onClose}>
      <div className="text-xs flex flex-col gap-5 p-3 pb-5">
          <button
            className="flex items-center gap-2 font-bold"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            onClick={toggleTheme}
          >
            {isDarkMode ? <GoSun size={18} /> : <GoMoon size={18} />}
            Toggle Theme
          </button>

          <button
            className="flex items-center gap-2 font-bold"
            onClick={handleChangeDir}
          >
              <GoFileDirectory size={18} />
              {rootDir}
          </button>
      </div>
    </ModalWrapper>
  );
}
