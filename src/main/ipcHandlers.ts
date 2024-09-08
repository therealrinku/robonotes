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

    const content = readFileSync(`${rootDir}/${noteName}.robu`, 'utf-8');
    const finalContent = { noteName, content };
    event.reply('read-note', finalContent);
  });

  ipcMain.on('rename-note', async (event, args) => {
    const [rootDir, noteName, newNoteName] = args;

    renameSync(`${rootDir}/${noteName}.robu`, `${rootDir}/${newNoteName}.robu`);
    event.reply('rename-note', { success: true });
  });

  ipcMain.on('delete-note', async (event, args) => {
    const [rootDir, noteName] = args;

    unlinkSync(`${rootDir}/${noteName}.robu`);
    event.reply('delete-note', { success: true });
  });

  ipcMain.on('save-note', async (event, args) => {
    const [rootDir, noteName, content] = args;

    writeFileSync(`${rootDir}/${noteName}.robu`, content);
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

  ipcMain.on('create-note', async (event, args) => {
    const [rootDir, noteName] = args;

    writeFileSync(`${rootDir}/${noteName}.robu`, '');
    event.reply('create-note', 'success');
  });
}
