import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface NoteModel {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface RootContextType {
  notes: NoteModel[];
  setNotes: Dispatch<SetStateAction<NoteModel[]>>;
  openNote: NoteModel | null;
  setOpenNote: Dispatch<SetStateAction<NoteModel | null>>;
  recentNotesId: number[];
  setRecentNotesId: Dispatch<SetStateAction<number[]>>;
}

const noop = (() => {}) as unknown as Dispatch<SetStateAction<unknown>>;

export const RootContext = createContext<RootContextType>({
  notes: [],
  setNotes: noop as Dispatch<SetStateAction<NoteModel[]>>,
  openNote: null,
  setOpenNote: noop as Dispatch<SetStateAction<NoteModel | null>>,
  recentNotesId: [],
  setRecentNotesId: noop as Dispatch<SetStateAction<number[]>>,
});

export function RootContextProvider({ children }: PropsWithChildren<{}>) {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [openNote, setOpenNote] = useState<NoteModel | null>(null);
  const [recentNotesId, setRecentNotesId] = useState<number[]>([]);

  useEffect(() => {
    if (!openNote) return;

    localStorage.setItem('openNoteId', openNote.id.toString());

    setRecentNotesId((prev) => {
      const filtered = prev.filter((noteId) => noteId !== openNote.id);
      filtered.unshift(openNote.id);

      const trimmed = filtered.slice(0, 10);
      localStorage.setItem('recents', JSON.stringify(trimmed));
      return trimmed;
    });
  }, [openNote]);

  useEffect(() => {
    const lastRecentsJSON = localStorage.getItem('recents');
    const lastRecents = lastRecentsJSON ? JSON.parse(lastRecentsJSON) : [];

    if (Array.isArray(lastRecents)) {
      const numeric = lastRecents
        .map((v: unknown) => Number(v))
        .filter((n) => !Number.isNaN(n));

      setRecentNotesId(numeric);
    }

    const loadNotesHandler = (arg: unknown) => {
      const castedArg = arg as unknown as NoteModel[] | undefined;
      setNotes(castedArg ?? []);

      const openNoteId = localStorage.getItem('openNoteId') ?? '';
      const lastOpenNote = (castedArg ?? []).find(
        (note) => note.id.toString() === openNoteId,
      );
      if (lastOpenNote) setOpenNote(lastOpenNote);
    };

    const errorHandler = (err: unknown) => {
      const msg = (err && (err as any).message) || String(err);
      // eslint-disable-next-line no-alert
      alert(msg);
    };

    window.electron.ipcRenderer.on('error-happened', errorHandler);
    window.electron.ipcRenderer.on('load-notes', loadNotesHandler);
    window.electron.ipcRenderer.sendMessage('load-notes');
  }, []);

  const contextValue = useMemo<RootContextType>(
    () => ({
      notes,
      setNotes,
      openNote,
      setOpenNote,
      recentNotesId,
      setRecentNotesId,
    }),
    [notes, setNotes, openNote, setOpenNote, recentNotesId, setRecentNotesId],
  );

  return (
    <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>
  );
}
