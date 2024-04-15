import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export const RootContext = createContext({
  notes: [],
  tags: {},
  rootDir: '',
  setNotes: Function,
  setRootDir: Function,
  selectedNoteIndex: -1,
  setSelectedNoteIndex: (index: number) => {},
  setTags: Function,
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState('');
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState({}); // struct => { tagName:  { noteName: true } }
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(-1);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-directory', (arg) => {
      //@ts-ignore
      setNotes(JSON.parse(arg) || []);
    });
    window.electron.ipcRenderer.sendMessage('load-directory', rootDir);

    setRootDir(localStorage.getItem('rootDir') || '');
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
        tags,
        //@ts-expect-error
        setTags,
      }}
    >
      {children}
    </RootContext.Provider>
  );
}
