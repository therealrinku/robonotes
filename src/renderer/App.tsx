import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import InitialSetup from './pages/InitialSetup';
import Home from './pages/Home';
import './App.css';
import { RootContextProvider } from './context/RootContext';
import useRootContext from './hooks/useRootContext';

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
  const { rootDir } = useRootContext();

  if (rootDir) {
    return <Home />;
  } else {
    return <InitialSetup />;
  }
}
