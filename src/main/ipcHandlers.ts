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
  ipcMain.on('check-if-root-dir-exists', async (event, args) => {
    const rootDir = args;

    const isValidRootDir = existsSync(rootDir);
    event.reply('check-if-root-dir-exists', isValidRootDir);
  });

  ipcMain.on('open-root-dir-selector', async (event, _) => {
    //@ts-ignore
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (canceled || !filePaths[0]) {
      return;
    }

    event.reply('open-root-dir-selector', filePaths[0]);
  });

  ipcMain.on('read-note', async (event, args) => {
    const [rootDir, noteName] = args;

    const content = readFileSync(`${rootDir}/${noteName}.txt`, 'utf-8');
    const finalContent = { noteName, content };
    event.reply('read-note', finalContent);
  });

  ipcMain.on('rename-note', async (event, args) => {
    const [rootDir, noteName, newNoteName] = args;

    renameSync(`${rootDir}/${noteName}.txt`, `${rootDir}/${newNoteName}.txt`);
    event.reply('rename-note', { success: true });
  });

  ipcMain.on('delete-note', async (event, args) => {
    const [rootDir, noteName] = args;

    unlinkSync(`${rootDir}/${noteName}.txt`);
    event.reply('delete-note', { success: true });
  });

  ipcMain.on('save-note', async (event, args) => {
    const [rootDir, noteName, content] = args;

    writeFileSync(`${rootDir}/${noteName}.txt`, content);
    event.reply('open-root-dir-selector', { success: true });
  });

  ipcMain.on('load-directory', async (event, dir) => {
    const allFiles: string[] = [];

    const files = readdirSync(dir);
    files.forEach((file) => {
      if (file.endsWith('.txt')) {
        allFiles.push(file.replace('.txt', ''));
      }
    });

    event.reply('load-directory', allFiles);
  });

  ipcMain.on('create-note', async (event, args) => {
    const [rootDir, noteName] = args;

    writeFileSync(`${rootDir}/${noteName}.txt`, '');
    event.reply('create-note', 'success');
  });
}
