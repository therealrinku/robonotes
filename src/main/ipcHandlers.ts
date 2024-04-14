import { dialog, ipcMain } from 'electron';
import { readFileSync, readdirSync, writeFileSync } from 'fs';

export function registerIpcHandlers(mainWindow: any) {
  ipcMain.on('open-root-dir-selector', async (event, _arg) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (canceled || !filePaths[0]) {
      return;
    }

    event.reply('open-root-dir-selector', filePaths[0]);
  });

  ipcMain.on('read-note', async (event, ...args) => {
    const [rootDir, fileName] = args;

    const content = readFileSync(`${rootDir}/${fileName}.robu`, 'utf-8');

    event.reply('read-note', JSON.parse(content));
  });

  ipcMain.on('save-file', async (event, args) => {
    const fileJson = {
      title: args[2],
      content: args[3],
    };

    writeFileSync(`${args[0]}/${args[1]}.robu`, JSON.stringify(fileJson));
    event.reply('open-root-dir-selector', { success: true });
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
