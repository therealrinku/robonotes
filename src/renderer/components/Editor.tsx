import { FiBold, FiItalic } from 'react-icons/fi';

export default function Editor() {
  return (
    <div className="w-full text-sm">
      <div className="flex flex-row items-center gap-2 p-3 self-end mx-auto">
        <div className="text-xs py-2 px-3 rounded bg-gray-100 flex flex-row items-center gap-5">
          <button className="hover:text-green-800">
            <FiBold />
          </button>
          <button className="hover:text-green-800">
            <FiItalic />
          </button>
        </div>

        <div className="ml-auto flex flex-row gap-2">
          <button className="text-xs bg-gray-100 hover:bg-gray-200 py-2 px-5 rounded">
            <p>Save</p>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mr-2">
        <input
          type="text"
          placeholder="Title..."
          className="p-3 outline-none"
          autoFocus={true}
          defaultValue={'2023 - Memo'}
        />

        <textarea
          className="w-full h-[80vh] p-3 outline-none"
          placeholder="My important note..."
        />
      </div>
    </div>
  );
}
