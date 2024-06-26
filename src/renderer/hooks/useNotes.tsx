import { useContext, useMemo } from 'react';
import { RootContext } from '../context/RootContext';

export default function useNotes() {
  const {
    notes,
    setNotes,
    selectedNoteIndex,
    setSelectedNoteIndex,
    rootDir,
    openedNotes,
    setOpenedNotes,
  } = useContext(RootContext);
  const selectedNoteName = notes[selectedNoteIndex];

  function handleOpenNote(noteName: string) {
    const noteIndex = notes.findIndex((nn) => nn === noteName);
    setSelectedNoteIndex(noteIndex);

    if (!openedNotes[noteName]) {
      window.electron.ipcRenderer.sendMessage('read-note', [rootDir, noteName]);
    }
  }

  function handleCreateNewNote() {
    let newNoteTitle =
      notes.length === 0 ? 'Untitled Note' : `Untitled Note (${notes.length})`;

    window.electron.ipcRenderer.sendMessage('create-note', [
      rootDir,
      newNoteTitle,
    ]);

    setNotes((prev) => [...prev, newNoteTitle]);
    setSelectedNoteIndex(notes.length);
  }

  function handleRenameNote(
    noteIndex: number,
    oldName: string,
    newName: string,
    description: string,
  ) {
    if (notes.includes(newName)) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('rename-note', [
      rootDir,
      oldName,
      newName,
    ]);

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = newName;
    setNotes(updatedNotes);

    const updatedOpenedNotes = { ...openedNotes };
    delete updatedOpenedNotes[oldName];
    updatedOpenedNotes[newName] = description;
    setOpenedNotes(updatedOpenedNotes);
  }

  function handleDeleteNote(noteName: string) {
    const confirmed = confirm(`Are you sure want to delete ${noteName}? `);

    if (!confirmed) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('delete-note', [rootDir, noteName]);
    setNotes((prev) => prev.filter((item) => item !== noteName));
    setSelectedNoteIndex(-1);
  }

  function handleCloseNote() {
    setSelectedNoteIndex(-1);
  }

  function handleSaveNote(noteDescription: string) {
    window.electron.ipcRenderer.sendMessage('save-note', [
      rootDir,
      selectedNoteName,
      noteDescription,
    ]);

    setOpenedNotes((prev) => {
      return {
        ...prev,
        [selectedNoteName]: noteDescription,
      };
    });
  }

  return {
    notes,
    selectedNoteName,
    selectedNoteContent: openedNotes[selectedNoteName],
    handleRenameNote,
    handleDeleteNote,
    handleOpenNote,
    handleCreateNewNote,
    handleCloseNote,
    handleSaveNote,
  };
}
