import { dialog, ipcMain } from 'electron';
import { existsSync } from 'fs';
import { RobonoteActions } from "./actions.ts";

const actions = new RobonoteActions();

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on('check-if-root-dir-exists', async (event, args) => {
    const rootDir = args;

    const isValidRootDir = existsSync(rootDir);
    event.reply('check-if-root-dir-exists', isValidRootDir);
  });

  ipcMain.on('open-root-dir-selector', async (event, _) => {
    //@ts-expect-error
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });

    if (canceled || !filePaths[0]) {
      return;
    }

    event.reply('open-root-dir-selector', filePaths[0]);
  });

  ipcMain.on('delete-note', async (event, id) => {
    try {
      await actions.deleteNote(id);
      event.reply('delete-note');
    } catch(err){
      event.reply("error-happened", { message: err.message });
    }
  });

  ipcMain.on('upsert-note', async (event, args) => {
    const [id, title, description] = args;

    try {
      const updatedNote = await actions.upsertNote(id, title, description);
      event.reply('upsert-note', updatedNote);
    } catch(err){
      event.reply("error-happened", { message: err.message });
    }
  });

  ipcMain.on('load-notes', async (event, dir) => {
    try {
      await actions.init(dir);
      const notes = await actions.getNotes();
      event.reply('load-notes', notes);
    } catch(err){
      event.reply("error-happened", { message: err.message });
    }
  });
}
