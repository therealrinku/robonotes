import { useContext } from 'react';
import { RootContext } from '../context/RootContext';
import { useNavigate } from 'react-router-dom';

export default function useNotes() {
  const navigate = useNavigate();
  const { notes, setNotes } = useContext(RootContext);

  function handleCreateNewNote() {
    window.electron.ipcRenderer.sendMessage('upsert-note', [null, '', '']);

    window.electron.ipcRenderer.once('upsert-note', updatedNoteItem => {
      //@ts-expect-error
      setNotes(prev=>[...prev, updatedNoteItem]);
      //@ts-expect-error
      navigate(`note/${updatedNoteItem.id}`);
    })
  }

  function handleUpdateNote(id: number, content: string) {
    window.electron.ipcRenderer.sendMessage('upsert-note', [id, content]);

    window.electron.ipcRenderer.once('upsert-note', updatedNoteItem => {
      const updatedNotes = [...notes];
      const noteIndex = notes.findIndex(note=> note.id === id);

      //@ts-expect-error
      updatedNotes[noteIndex] = updatedNoteItem;
      setNotes(updatedNotes);
    })
  }

  function handleDeleteNote(id:number) {
    const confirmed = confirm(`Are you sure want to delete this note? `);
    if (!confirmed) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('delete-note', id);

    window.electron.ipcRenderer.on('delete-note', ()=>{
      setNotes((prev) => prev.filter((note) => note.id !== id));
      navigate(-1);
    });
  }

  return { notes, handleUpdateNote, handleDeleteNote, handleCreateNewNote };
}
