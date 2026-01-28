import { useEffect, useState } from 'react';
import './App.css';
import { RootContextProvider } from './context/RootContext';
import Loading from './components/Loading';
import Editor from './pages/Editor';
import SearchModal from './components/SearchModal';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);

  function keyboardShortcutsHandler(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      setShowSearchModal(true);
    }

    // if ((e.ctrlKey || e.metaKey) && e.key === '=') {
    //   window.electron.ipcRenderer.sendMessage('upsert-note', [null, '']);
    // }

    if (e.key === 'Escape') {
      setShowSearchModal(false);
    }
  }

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

    window.addEventListener('keydown', keyboardShortcutsHandler);
    return () => {
      window.removeEventListener('keydown', keyboardShortcutsHandler);
    };
  }, []);

  if (showLoading) {
    return <Loading />;
  }

  return (
    <RootContextProvider>
      {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}

      <Editor />
    </RootContextProvider>
  );
}
