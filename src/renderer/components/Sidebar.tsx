import { useState } from 'react';
import { FiFilePlus, FiFileText, FiSearch, FiTag } from 'react-icons/fi';

interface Props {
  handleNewFile: () => void;
}

export default function Sidebar({ handleNewFile }: Props) {
  return (
    <div className="bg-gray-200 w-72 min-h-screen flex flex-col items-center gap-5 py-5">
      <p className="font-bold">robunot</p>

      <div className="relative w-full px-3">
        <FiSearch className="absolute left-5 top-2" />
        <input
          placeholder="Search..."
          className="bg-gray-100 pl-8 pr-2 rounded w-full text-xs py-2 outline-none"
        />
      </div>

      <div className="w-full flex flex-col gap-2 border-white border-t pt-5 overflow-y-auto max-h-[85vh] px-3">
        <button
          onClick={handleNewFile}
          className="flex flex-row gap-2 items-center self-start text-xs py-2"
        >
          <FiFilePlus />
          <p>New</p>
        </button>

        {/* {new Array(5).fill({}).map((_item, index) => {
          return (
            <button
              key={index}
              className="h-full p-2 w-full text-xs bg-gray-100 hover:outline-dashed outline-1  w-full rounded"
            >
              <div className="flex flex-row items-center gap-1">
                <FiFileText />
                <p>2023 - Memo</p>
              </div>

              <div className="mt-2 flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-1">
                  <FiTag />
                  <p>Holimoli</p>
                </div>
              </div>
            </button>
          );
        })} */}
      </div>
    </div>
  );
}
