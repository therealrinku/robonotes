import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

interface TagsModel {
  [tagName: string]: {
    [noteName: string]: boolean;
  };
}

interface NoteModel {
  [noteName: string]: {
    title: string;
    content: string;
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
  openedNotes: NoteModel;
  setOpenedNotes: Dispatch<SetStateAction<NoteModel>>;
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
  openedNotes: {},
  setOpenedNotes: () => {},
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState<string>('');
  const [notes, setNotes] = useState<Array<string>>([]);
  const [tags, setTags] = useState<TagsModel>({});
  // cached note content
  const [openedNotes, setOpenedNotes] = useState<NoteModel>({});
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(-1);

  useEffect(() => {
    window.electron.ipcRenderer.on('read-note', (arg) => {
      type noteObject = { noteName: string; title: string; content: string };

      const castedArg = arg as noteObject;
      setOpenedNotes((prev) => {
        return {
          ...prev,
          [castedArg.noteName]: {
            title: castedArg.title,
            content: castedArg.content,
          },
        };
      });
    });

    window.electron.ipcRenderer.on('load-directory', (arg) => {
      const castedArg = arg as string[];
      setNotes(castedArg || []);
    });

    window.electron.ipcRenderer.on('load-tags', (arg) => {
      const castedArg = arg as TagsModel;
      setTags(castedArg || {});
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
        openedNotes,
        setOpenedNotes,
      }}
    >
      {children}
    </RootContext.Provider>
  );
}
