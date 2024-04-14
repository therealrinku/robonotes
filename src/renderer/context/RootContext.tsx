import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export const RootContext = createContext({
  notes: [],
  rootDir: '',
  setNotes: Function,
  setRootDir: Function,
});

export function RootContextProvider({ children }: PropsWithChildren) {
  const [rootDir, setRootDir] = useState(localStorage.getItem('rootDir') || '');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.once('load-directory', (arg) => {
      //@ts-ignore
      setNotes(JSON.parse(arg) || []);
    });

    // static folder for now
    // this directory will come from localstorage later
    window.electron.ipcRenderer.sendMessage('load-directory', rootDir);
  }, []);

  return (
    //@ts-expect-error
    <RootContext.Provider value={{ rootDir, setRootDir, notes, setNotes }}>
      {children}
    </RootContext.Provider>
  );
}
