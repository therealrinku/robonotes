import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useDir() {
  const { rootDir, setRootDir } = useContext(RootContext);

  function handleChangeDir() {
    window.electron.ipcRenderer.once('open-root-dir-selector', (arg) => {
      const path = String(arg);
      window.localStorage.setItem('rootDir', path);
      setRootDir(String(arg));
    });

    window.electron.ipcRenderer.sendMessage('open-root-dir-selector');
  }

  return { rootDir, handleChangeDir, setRootDir };
}
