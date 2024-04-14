import { dialog, ipcMain } from 'electron';
import { readdirSync, writeFileSync } from 'fs';

export function registerIpcHandlers(mainWindow: any) {
  ipcMain.on('open-new-file-dialog', async (event, _arg) => {
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

    writeFileSync(`${args[0]}/${args[1]}.robu`, JSON.stringify(fileJson));
    event.reply('open-new-file-dialog', { success: true });
  });

  ipcMain.on('load-directory', async (event, dir) => {
    //@ts-ignore
    const allFiles = [];

    const files = readdirSync(dir);
    files.forEach((file) => {
      if (file.endsWith('.robu')) {
        allFiles.push(file.replace('.robu', ''));
      }
    });

    //@ts-ignore
    event.reply('load-directory', JSON.stringify(allFiles));
  });

  ipcMain.on('create-note', async (event, ...dir) => {
    //@ts-ignore
    const folderPath = dir[0];
    const fileName = dir[1];

    const fileJson = {
      title: fileName,
      content: '',
    };

    writeFileSync(`${folderPath}/${fileName}.robu`, JSON.stringify(fileJson));

    event.reply('create-note', 'success');
  });
}
