import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import InitialSetup from './pages/InitialSetup';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialSetup />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
}
