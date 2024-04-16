import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

interface TagsModel {
  [key: string]: {
    [key: string]: boolean;
  };
}
interface RootContextProps {
  notes: string[];
  tags: TagsModel;
  rootDir: string;
  setNotes: Dispatch<SetStateAction<string[]>>;
  setRootDir: Dispatch<SetStateAction<string>>;
  selectedNoteIndex: number;
  setSelectedNoteIndex: Dispatch<SetStateAction<number>>;
  setTags: Dispatch<SetStateAction<TagsModel>>;
}

export const RootContext = createContext<RootContextProps>({
  notes: [],
  tags: {},
  rootDir: '',
  setNotes: () => {},
  setRootDir: () => {},
  selectedNoteIndex: -1,
  setSelectedNoteIndex: () => {},
  setTags: () => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState<string>('');
  const [notes, setNotes] = useState<Array<string>>([]);
  const [tags, setTags] = useState<TagsModel>({});
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(-1);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-directory', (arg) => {
      //@ts-ignore
      setNotes(JSON.parse(arg) || []);
    });

    window.electron.ipcRenderer.on('load-tags', (arg) => {
      //@ts-ignore
      setTags(JSON.parse(arg) || []);
    });
    
    window.electron.ipcRenderer.sendMessage('load-directory', rootDir);
    window.electron.ipcRenderer.sendMessage('load-tags', rootDir);

    setRootDir(localStorage.getItem('rootDir') || '');
  }, [rootDir]);

  return (
    <RootContext.Provider
      value={{
        rootDir,
        setRootDir,
        notes,
        setNotes,
        selectedNoteIndex,
        setSelectedNoteIndex,
        tags,
        setTags,
      }}
    >
      {children}
    </RootContext.Provider>
  );
}
