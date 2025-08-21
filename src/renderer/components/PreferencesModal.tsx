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

  useEffect(() => {
    window.electron.ipcRenderer.on('toggle-theme', () => {
      toggleTheme();
    });
  }, [])

  return (
    <ModalWrapper title={`Preferences`} onClose={onClose}>
      <div className="text-xs flex flex-col gap-7 px-3 pb-5">
        <div className='flex flex-col gap-2'>
          <b>Theme</b>

          <div className='flex flex-row gap-2 items-center justify-center'>
            <button onClick={toggleTheme} className={`flex flex-col items-center  gap-3 p-5 w-[49%] rounded ${isDarkMode && "bg-green-900"}`}>
              <GoMoon size={18} />
              <p>Dark Mode</p>
            </button>
            <button onClick={toggleTheme} className={`flex flex-col items-center  gap-3 p-5 w-[49%] rounded ${!isDarkMode && "bg-green-900 text-white"}`}>
              <GoSun size={18} />
              <p>Light Mode</p>
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <b>Root Directory</b>

          <button
            className="flex items-center gap-2 font-bold"
            onClick={handleChangeDir}
          >
            <GoFileDirectory size={18} />
            {rootDir}
          </button>
        </div>

        <p className='fixed bottom-1'>robonotes v{configs.version}</p>
      </div>
    </ModalWrapper>
  );
}
