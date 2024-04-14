import { useEffect, useState } from 'react';
import { FiFilePlus, FiFileText, FiSearch, FiTag } from 'react-icons/fi';

interface Props {
  handleNewFile: () => void;
}

export default function Sidebar({ handleNewFile }: Props) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.once('load-directory', (arg) => {
      //@ts-ignore
      setFiles(JSON.parse(arg) || []);
    });

    // static folder for now
    // this directory will come from localstorage later
    window.electron.ipcRenderer.sendMessage('load-directory', [
      '/home/r1nku/Downloads/test-folder',
    ]);
  }, []);

  return (
    <div className="bg-gray-200 w-72 min-h-screen flex flex-col items-center gap-5 py-5">
      <p className="absolute bottom-2 text-xs align-start">robunot v0.0.0</p>

      <div className="px-3">
        <div className="relative w-full">
          <FiSearch className="absolute left-2 top-2" color="gray" />
          <input
            placeholder="Search..."
            className="bg-gray-100 pl-8 pr-2 rounded w-full text-xs py-2 outline-none"
          />
        </div>

        <div className="mt-3 flex flex-row items-center gap-5">
          <button onClick={handleNewFile} className="py-2">
            <FiFilePlus />
          </button>

          <button onClick={handleNewFile} className="py-2">
            <FiTag />
          </button>
        </div>
      </div>

      <div className="w-full pb-5 flex flex-col gap-2 border-white border-t pt-5 overflow-y-auto max-h-[85vh] px-3">
        {Array.isArray(files) &&
          files.map((fileName: string, index) => {
            return (
              <button
                key={index}
                className="h-full p-2 w-full text-xs bg-gray-100 hover:outline-dashed outline-1  w-full rounded"
              >
                <div className="flex flex-row items-center gap-1">
                  <FiFileText />
                  <p className="truncate max-w-[85%]">
                    {fileName.slice(0, fileName.indexOf('.json'))}
                  </p>
                </div>

                {/* <div className="mt-2 flex flex-row items-center gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <FiTag />
                    <p>Holimoli</p>
                  </div>
                </div> */}
              </button>
            );
          })}
      </div>
    </div>
  );
}
