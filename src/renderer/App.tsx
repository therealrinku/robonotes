import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import { RootContextProvider } from './context/RootContext';
import Loading from './components/Loading';
import Home from './pages/Home';
import Editor from './pages/Editor';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const rootDir = localStorage.getItem('rootDir');

  // show loading animation for 2 seconds
  useEffect(() => {
    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // load-theme
    if (localStorage.getItem('color-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // change-theme from menubar
    window.electron.ipcRenderer.on('toggle-theme', () => {
      toggleTheme();
    });
  }, []);

  function toggleTheme() {
    if (localStorage.getItem('color-theme') === 'dark') {
      localStorage.setItem('color-theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('color-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }

  if (showLoading) {
    return <Loading />;
  }

  return (
    <RootContextProvider>
      <Editor />
    </RootContextProvider>
  );
}
