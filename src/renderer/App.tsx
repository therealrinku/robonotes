import { useEffect, useState } from 'react';
import './App.css';
import { RootContextProvider } from './context/RootContext';
import Loading from './components/Loading';
import Editor from './pages/Editor';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  function toggleTheme() {
    if (localStorage.getItem('color-theme') === 'dark') {
      localStorage.setItem('color-theme', 'light');
      document.documentElement.classList.remove('dark');
      return;
    }
    localStorage.setItem('color-theme', 'dark');
    document.documentElement.classList.add('dark');
  }

  useEffect(() => {
    setTimeout(() => setShowLoading(false), 2000);

    if (localStorage.getItem('color-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }

    window.electron.ipcRenderer.on('toggle-theme', () => {
      toggleTheme();
    });
  }, []);

  if (showLoading) {
    return <Loading />;
  }

  return (
    <RootContextProvider>
      <Editor />
    </RootContextProvider>
  );
}
