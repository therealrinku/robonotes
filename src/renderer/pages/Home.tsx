import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import useNotes from '../hooks/useNotes.tsx';

export default function Home() {
  return (
    <div className="flex flex-row overflow-x-hidden dark:text-white">
      <Sidebar />
      <Editor/>
    </div>
  );
}
