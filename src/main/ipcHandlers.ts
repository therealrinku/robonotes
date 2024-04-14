import { dialog, ipcMain } from 'electron';
import { writeFile, writeFileSync } from 'fs';

export function registerIpcHandlers(mainWindow: any) {
  ipcMain.on('open-new-file-dialog', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
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
}
