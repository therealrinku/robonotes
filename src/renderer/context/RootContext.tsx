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
  const [rootDir, setRootDir] = useState<string | null>(localStorage.getItem("rootDir") ?? null);
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-notes', (arg) => {
      const castedArg = arg as NoteModel[];
      setNotes(castedArg || []);
    });

    window.electron.ipcRenderer.on(
      'check-if-root-dir-exists',
      (isValidRootDir) => {
        if (!isValidRootDir) {
          setRootDir(null);
        } else {
          setRootDir(localStorage.getItem('rootDir') ?? null);
        }
      },
    );

    window.electron.ipcRenderer.sendMessage('load-notes', rootDir);
    window.electron.ipcRenderer.sendMessage('check-if-root-dir-exists', localStorage.getItem('rootDir'));
  }, [rootDir]);

  useEffect(()=>{
    window.electron.ipcRenderer.on('error-happened', err => {
      alert(err.message);
    })
  },[])

  return (
    <RootContext.Provider value={{ notes, setNotes, rootDir, setRootDir }}>
      {children}
    </RootContext.Provider>
  );
}
