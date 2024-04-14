import { useState } from 'react';
import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';

export default function Home() {
  const [filePath, setFilePath] = useState('');

  function handleNewFile() {
    window.electron.ipcRenderer.once('open-new-file-dialog', (arg) => {
      setFilePath(String(arg));
    });
    window.electron.ipcRenderer.sendMessage('open-new-file-dialog');
  }

  function handleSave(title: string, description: string) {
    window.electron.ipcRenderer.once('open-new-file-dialog', (arg) => {
      //@ts-ignore
      if (arg.success) {
        alert('File saved successfully!');
      }
    });

    const args = [filePath, title, description];
    window.electron.ipcRenderer.sendMessage('save-file', args);
  }

  return (
    <div className="flex flex-row gap-3">
      <Sidebar handleNewFile={handleNewFile} />
      <Editor onSave={handleSave} />
    </div>
  );
}
