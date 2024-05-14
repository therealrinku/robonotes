import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="flex flex-row overflow-x-hidden dark:text-white">
      <Sidebar />
      <Editor />
    </div>
  );
}