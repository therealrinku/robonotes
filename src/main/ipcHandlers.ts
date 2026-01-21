import { ipcMain } from 'electron';
import RobonoteActions from './actions';

const actions = new RobonoteActions();

export default async function registerIpcHandlers() {
  ipcMain.on('delete-note', async (event, id) => {
    try {
      await actions.init();
      await actions.deleteNote(id);
      event.reply('delete-note');
    } catch (err: any) {
      event.reply('error-happened', { message: err.message });
    }
  });

  ipcMain.on('upsert-note', async (event, args) => {
    const [id, description] = args;

    try {
      await actions.init();
      const updatedNote = await actions.upsertNote(id, description);
      event.reply('upsert-note', updatedNote);
    } catch (err: any) {
      event.reply('error-happened', { message: err.message });
    }
  });

  ipcMain.on('load-notes', async (event) => {
    try {
      await actions.init();
      const notes = await actions.getNotes();
      event.reply('load-notes', notes);
    } catch (err: any) {
      event.reply('error-happened', { message: err.message });
    }
  });
}
