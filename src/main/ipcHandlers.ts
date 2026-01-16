import { ipcMain, app } from 'electron';
import RobonoteActions from './actions';

const actions = new RobonoteActions();

export default function registerIpcHandlers() {
  ipcMain.on('delete-note', async (event, id) => {
    try {
      await actions.deleteNote(id);
      event.reply('delete-note');
    } catch (err: any) {
      event.reply('error-happened', { message: err.message });
    }
  });

  ipcMain.on('upsert-note', async (event, args) => {
    const [id, description] = args;

    try {
      const updatedNote = await actions.upsertNote(id, description);
      event.reply('upsert-note', updatedNote);
    } catch (err: any) {
      event.reply('error-happened', { message: err.message });
    }
  });

  ipcMain.on('load-notes', async (event) => {
    try {
      // we use documents folder as directory to save notes
      // no option to change it for now!!
      const documentDir = app.getPath('documents');
      await actions.init(documentDir);
      const notes = await actions.getNotes();
      event.reply('load-notes', notes);
    } catch (err: any) {
      event.reply('error-happened', { message: err.message });
    }
  });
}
