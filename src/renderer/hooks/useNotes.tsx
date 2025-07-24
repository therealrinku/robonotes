import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useNotes() {
  const { notes, setNotes } = useContext(RootContext);

  function handleCreateNewNote() {
    const title = notes.length === 0 ? 'Untitled Note' : `Untitled Note (${notes.length})`;

    window.electron.ipcRenderer.sendMessage('upsert-note', [null, title, '']);

    window.electron.ipcRenderer.once('upsert-note', updatedNoteItem => {
      setNotes(prev=>[...prev, updatedNoteItem]);
    })
  }

  function handleUpdateNote(
    id: number,
    title: string,
    description: string,
  ) {
    window.electron.ipcRenderer.sendMessage('upsert-note', [id, title, description]);

    window.electron.ipcRenderer.once('upsert-note', updatedNoteItem => {
      const updatedNotes = [...notes];
      const noteIndex = notes.findIndex(note=> note.id === id);
      updatedNotes[noteIndex] = updatedNoteItem;
      setNotes(updatedNotes);
    })
  }

  function handleDeleteNote(id:number, title: string) {
    const confirmed = confirm(`Are you sure want to delete ${title}? `);
    if (!confirmed) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('delete-note', id);

    window.electron.ipcRenderer.on('delete-note', ()=>{
      setNotes((prev) => prev.filter((note) => note.id !== id));
    });
  }

  return { notes, handleUpdateNote, handleDeleteNote, handleCreateNewNote };
}
