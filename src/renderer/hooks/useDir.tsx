import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useDir() {
  const { rootDir, setRootDir } = useContext(RootContext);

  function handleChangeDir() {
    window.electron.ipcRenderer.once('open-root-dir-selector', (arg) => {
      window.localStorage.setItem('rootDir', String(arg));
      setRootDir(String(arg));
    });

    window.electron.ipcRenderer.sendMessage('open-root-dir-selector');
  }

  return { rootDir, handleChangeDir };
}
