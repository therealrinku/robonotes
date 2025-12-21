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
  const [rootDir, setRootDir] = useState<string | null>(
    localStorage.getItem('rootDir') ?? null,
  );
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [openNote, setOpenNote] = useState<NoteModel | null>(null);
  const [recentNotesId, setRecentNotesId] = useState([]);

  useEffect(() => {
    if (openNote) {
      localStorage.setItem('openNoteId', openNote.id);

      // add to recents
      // if it's there remove it and unshift
      // if it's not there pop last item and unshift
      const filtered = recentNotesId.filter((noteId) => noteId !== openNote.id);
      if (filtered.length !== recentNotesId.length) {
        filtered.pop();
      }
      filtered.unshift(openNote.id);
      setRecentNotesId(filtered);
      localStorage.setItem('recents', JSON.stringify(filtered));
    }
  }, [openNote]);

  useEffect(() => {
    window.electron.ipcRenderer.on('load-notes', (arg) => {
      const castedArg = arg as NoteModel[];
      setNotes(castedArg || []);

      const openNoteId = localStorage.getItem('openNoteId');
      const openNote_ = castedArg.find((note) => note.id == openNoteId); //shallow compare with '=='
      if (openNote_) setOpenNote(openNote_);
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
    window.electron.ipcRenderer.sendMessage(
      'check-if-root-dir-exists',
      localStorage.getItem('rootDir'),
    );
  }, [rootDir]);

  useEffect(() => {
    const recents = localStorage.getItem('recents');
    const recents_ = recents ? JSON.parse(recents) : [];
    if (Array.isArray(recents)) {
      setRecentNotesId(recents_);
    }

    window.electron.ipcRenderer.on('error-happened', (err) => {
      alert(err.message);
    });
  }, []);

  return (
    <RootContext.Provider
      value={{
        notes,
        setNotes,
        rootDir,
        setRootDir,
        openNote,
        setOpenNote,
        recentNotesId,
        setRecentNotesId,
      }}
    >
      {children}
    </RootContext.Provider>
  );
}
