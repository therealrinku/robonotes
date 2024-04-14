import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import useRootContext from '../hooks/useRootContext';

export default function Home() {
  const { rootDir } = useRootContext();

  function handleSave(title: string, description: string) {
    window.electron.ipcRenderer.once('open-root-dir-selector', (arg) => {
      //@ts-ignore
      if (arg.success) {
        alert('File saved successfully!');
      }
    });

    const args = [rootDir, title, description];
    window.electron.ipcRenderer.sendMessage('save-file', args);
  }

  return (
    <div className="flex flex-row gap-3">
      <Sidebar />
      <Editor onSave={handleSave} />
    </div>
  );
}
