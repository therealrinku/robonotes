import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import InitialSetup from './pages/InitialSetup';
import Home from './pages/Home';
import './App.css';
import { RootContextProvider } from './context/RootContext';
import useDir from './hooks/useDir';
import { useEffect, useState } from 'react';
import Loading from './components/Loading';

export default function App() {
  return (
    <Router>
      <RootContextProvider>
        <Routes>
          <Route path="/" Component={SetupApp} />
        </Routes>
      </RootContextProvider>
    </Router>
  );
}

function SetupApp() {
  const { rootDir } = useDir();

  const [showLoading, setShowLoading] = useState(true);

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
  } else if (rootDir) {
    return <Home />;
  } else {
    return <InitialSetup />;
  }
}
