import { dialog, ipcMain } from 'electron';
import {
  readFileSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
  existsSync,
} from 'fs';

export function registerIpcHandlers(mainWindow: Electron.BrowserWindow | null) {
  ipcMain.on('check-if-root-dir-exists', async (event, ...args) => {
    const rootDir = args[0];

    const isValidRootDir = existsSync(rootDir);
    event.reply('check-if-root-dir-exists', isValidRootDir);
  });

  ipcMain.on('load-tags', async (event, ...args) => {
    const rootDir = args[0];
    const fileName = `tags.json`;

    const tags = readFileSync(`${rootDir}/${fileName}`, 'utf-8');
    event.reply('load-tags', JSON.parse(tags));
  });

  ipcMain.on('update-tags', async (event, ...args) => {
    const rootDir = args[0];
    const fileName = `tags.json`;

    writeFileSync(`${rootDir}/${fileName}`, JSON.stringify(args[1]));
    event.reply('update-tags', { success: true });
  });

  ipcMain.on('open-root-dir-selector', async (event, _arg) => {
    //@ts-ignore
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (canceled || !filePaths[0]) {
      return;
    }

    event.reply('open-root-dir-selector', filePaths[0]);
  });

  ipcMain.on('read-note', async (event, ...args) => {
    const [rootDir, noteName] = args;

    const content = readFileSync(`${rootDir}/${noteName}.robu`, 'utf-8');

    const parsedContent = JSON.parse(content) || {};
    const finalContent = { noteName, ...parsedContent };
    event.reply('read-note', finalContent);
  });

  ipcMain.on('rename-note', async (event, ...args) => {
    renameSync(`${args[0]}/${args[1]}.robu`, `${args[0]}/${args[2]}.robu`);
    event.reply('rename-note', { success: true });
  });

  ipcMain.on('delete-note', async (event, ...args) => {
    unlinkSync(`${args[0]}/${args[1]}.robu`);
    event.reply('delete-note', { success: true });
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
    const allFiles: string[] = [];

    const files = readdirSync(dir);
    files.forEach((file) => {
      if (file.endsWith('.robu')) {
        allFiles.push(file.replace('.robu', ''));
      }
    });

    event.reply('load-directory', allFiles);
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
