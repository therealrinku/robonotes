import { dialog, ipcMain } from 'electron';
import { readdirSync, writeFileSync } from 'fs';

export function registerIpcHandlers(mainWindow: any) {
  ipcMain.on('open-new-file-dialog', async (event, arg) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    event.reply('open-new-file-dialog', filePaths[0]);
  });

  ipcMain.on('save-file', async (event, args) => {
    const fileJson = {
      title: args[1],
      content: args[2],
    };

    writeFileSync(`${args[0]}/${args[1]}.json`, JSON.stringify(fileJson));
    event.reply('open-new-file-dialog', { success: true });
  });

  ipcMain.on('load-directory', async (event, args) => {
    //@ts-ignore
    const allFiles = [];

    const files = readdirSync(args[0]);
    files.forEach((file) => {
      if (file.endsWith('.json')) {
        allFiles.push(file);
      }
    });

    //@ts-ignore
    event.reply('load-directory', JSON.stringify(allFiles));
    console.log('hyaaa');
  });
}
