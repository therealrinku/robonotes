import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

interface NoteModel {
  [noteName: string]: string;
}

interface RootContextProps {
  notes: string[];
  rootDir: string;
  setNotes: Dispatch<SetStateAction<string[]>>;
  setRootDir: Dispatch<SetStateAction<string>>;
  selectedNoteIndex: number;
  setSelectedNoteIndex: Dispatch<SetStateAction<number>>;
  openedNotes: NoteModel;
  setOpenedNotes: Dispatch<SetStateAction<NoteModel>>;
}

export const RootContext = createContext<RootContextProps>({
  notes: [],
  rootDir: '',
  setNotes: () => {},
  setRootDir: () => {},
  selectedNoteIndex: -1,
  setSelectedNoteIndex: () => {},
  openedNotes: {},
  setOpenedNotes: () => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState<string>('');
  const [notes, setNotes] = useState<Array<string>>([]);
  const [openedNotes, setOpenedNotes] = useState<NoteModel>({}); //cache
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(-1);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-directory', (arg) => {
      const castedArg = arg as string[];
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

    window.electron.ipcRenderer.sendMessage('load-directory', rootDir);
  }, [rootDir]);

  useEffect(() => {
    window.electron.ipcRenderer.on('read-note', (arg) => {
      type noteObject = { noteName: string; content: string };

      const castedArg = arg as noteObject;

      setOpenedNotes((prev) => {
        return {
          ...prev,
          [castedArg.noteName]: castedArg.content,
        };
      });
    });

    window.electron.ipcRenderer.sendMessage(
      'check-if-root-dir-exists',
      localStorage.getItem('rootDir'),
    );
  }, []);

  return (
    <RootContext.Provider
      value={{
        rootDir,
        setRootDir,
        notes,
        setNotes,
        selectedNoteIndex,
        setSelectedNoteIndex,
        openedNotes,
        setOpenedNotes,
      }}
    >
      {children}
    </RootContext.Provider>
  );
}
