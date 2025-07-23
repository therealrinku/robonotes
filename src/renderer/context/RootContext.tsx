import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

interface NoteModel {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface RootContextProps {
  notes: NoteModel[];
  rootDir: string;
  setNotes: Dispatch<SetStateAction<NoteModel[]>>;
  setRootDir: Dispatch<SetStateAction<string>>;
}

export const RootContext = createContext<RootContextProps>({
  notes: [],
  rootDir: '',
  setNotes: () => {},
  setRootDir: () => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-notes', (arg) => {
      const castedArg = arg as NoteModel[];
      setNotes(castedArg || []);
    });

    // validate if root dir is actually a valid directory in the filesystem
    window.electron.ipcRenderer.on(
      'check-if-root-dir-exists',
      (isValidRootDir) => {
        if (!isValidRootDir) {
          setRootDir('');
        } else {
          setRootDir(localStorage.getItem('rootDir') || '');
        }
      },
    );

    window.electron.ipcRenderer.sendMessage('load-notes', rootDir);
  }, [rootDir]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage(
      'check-if-root-dir-exists',
      localStorage.getItem('rootDir'),
    );
  }, []);

  return (
    <RootContext.Provider value={{ notes, setNotes }}>
      {children}
    </RootContext.Provider>
  );
}
