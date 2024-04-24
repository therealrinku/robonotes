import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useTheme() {
  const { theme, setTheme } = useContext(RootContext);

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }

  return { theme, toggleTheme };
}
