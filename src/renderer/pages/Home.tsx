import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import useNotes from '../hooks/useNotes.tsx';

export default function Home() {
  const { selectedNoteName } = useNotes();
  return (
    <div className="flex flex-row overflow-x-hidden dark:text-white">
      { selectedNoteName ? <Editor /> : <Sidebar /> }
    </div>
  );
}
