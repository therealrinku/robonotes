import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

interface NoteModel {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function useNotes() {
  const {
    notes,
    setNotes,
    openNote,
    setOpenNote,
    recentNotesId,
    setRecentNotesId,
  } = useContext(RootContext);

  function handleCreateNewNote(content: string = '') {
    window.electron.ipcRenderer.sendMessage('upsert-note', [null, content]);

    window.electron.ipcRenderer.once('upsert-note', (updatedNoteItem) => {
      setNotes((prev) => [...prev, updatedNoteItem as NoteModel]);
      setOpenNote(updatedNoteItem as NoteModel);
    });
  }

  function handleUpdateNote(id: number, content: string) {
    window.electron.ipcRenderer.sendMessage('upsert-note', [id, content]);

    window.electron.ipcRenderer.once('upsert-note', (updatedNoteItem) => {
      const updatedNotes = [...notes];
      const noteIndex = notes.findIndex((note) => note.id === id);

      updatedNotes[noteIndex] = updatedNoteItem as NoteModel;
      setNotes(updatedNotes);

      if ((updatedNoteItem as NoteModel).id === openNote?.id) {
        setOpenNote(updatedNoteItem as NoteModel);
      }
    });
  }

  function handleDeleteNote(id: number) {
    const confirmed = confirm(`Are you sure want to delete this note? `);
    if (!confirmed) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('delete-note', id);

    window.electron.ipcRenderer.on('delete-note', () => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      setOpenNote(null);
      setRecentNotesId((prev) => prev.filter((noteId) => noteId! === id));
    });
  }

  function handleOpenNote(note: NoteModel) {
    setOpenNote(note);
  }

  function handleCloseNote() {
    setOpenNote(null);
  }

  return {
    notes,
    handleOpenNote,
    handleCloseNote,
    handleUpdateNote,
    handleDeleteNote,
    handleCreateNewNote,
    openNote,
    setOpenNote,
    recentNotesId,
  };
}
