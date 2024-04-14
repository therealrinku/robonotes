import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export const RootContext = createContext({
  notes: [],
  rootDir: '',
  setNotes: Function,
  setRootDir: Function,
  selectedNoteIndex: -1,
  setSelectedNoteIndex: (index: number) => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(-1);

  useEffect(() => {
    setRootDir(localStorage.getItem('rootDir') || '');

    window.electron.ipcRenderer.on('load-directory', (arg) => {
      //@ts-ignore
      setNotes(JSON.parse(arg) || []);
    });
    window.electron.ipcRenderer.sendMessage('load-directory', rootDir);
  }, [rootDir]);

  return (
    <RootContext.Provider
      value={{
        rootDir,
        //@ts-expect-error
        setRootDir,
        notes,
        //@ts-expect-error
        setNotes,
        selectedNoteIndex,
        setSelectedNoteIndex,
      }}
    >
      {children}
    </RootContext.Provider>
  );
}
