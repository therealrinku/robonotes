import { useContext } from 'react';
import { RootContext } from '../context/RootContext';
import useTags from './useTags';

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

  const { moveTagToRenamedNote, removeNoteFromAssociatedTags } = useTags();

  const selectedNoteName = notes[selectedNoteIndex];

  function handleOpenNote(noteName: string) {
    const noteIndex = notes.findIndex((nn) => nn === noteName);
    setSelectedNoteIndex(noteIndex);

    if (!openedNotes[noteName]) {
      window.electron.ipcRenderer.sendMessage('read-note', rootDir, noteName);
    }
  }

  function handleCreateNewNote() {
    let newNoteTitle =
      notes.length === 0 ? 'Untitled Note' : `Untitled Note (${notes.length})`;

    window.electron.ipcRenderer.sendMessage(
      'create-note',
      rootDir,
      newNoteTitle,
    );

    setNotes((prev) => [...prev, newNoteTitle]);
    setSelectedNoteIndex(notes.length);
  }

  function handleRenameNote(
    noteIndex: number,
    oldName: string,
    newName: string,
  ) {
    if (notes.includes(newName)) {
      alert('Note with same name already exists!');
      return;
    }

    // first remove tag from last note name
    // then add that tag to new note name
    moveTagToRenamedNote(oldName, newName);

    window.electron.ipcRenderer.sendMessage(
      'rename-note',
      rootDir,
      oldName,
      newName,
    );

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = newName;
    setNotes(updatedNotes);
  }

  function handleDeleteNote(noteName: string) {
    const confirmed = confirm(`Are you sure want to delete ${noteName}? `);

    if (!confirmed) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('delete-note', rootDir, noteName);

    removeNoteFromAssociatedTags(noteName);

    setNotes((prev) => prev.filter((item) => item !== noteName));
    setSelectedNoteIndex(-1);
  }

  function handleCloseNote() {
    setSelectedNoteIndex(-1);
  }

  function handleSaveNote(noteTitle: string, noteDescription: string) {
    const args = [rootDir, selectedNoteName, noteTitle, noteDescription];
    window.electron.ipcRenderer.sendMessage('save-file', args);

    setOpenedNotes((prev) => {
      return {
        ...prev,
        [selectedNoteName]: {
          title: noteTitle,
          content: noteDescription,
        },
      };
    });
  }

  return {
    notes,
    selectedNoteName,
    selectedNote: openedNotes[selectedNoteName],
    handleRenameNote,
    handleDeleteNote,
    handleOpenNote,
    handleCreateNewNote,
    handleCloseNote,
    handleSaveNote,
  };
}
