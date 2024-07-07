import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-row overflow-x-hidden dark:text-white">
      {isSidebarOpen && <Sidebar />}
      <Editor
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
    </div>
  );
}
