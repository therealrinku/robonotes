import { FiBold, FiItalic } from 'react-icons/fi';

export default function Editor() {
  return (
    <div className="w-full text-sm">
      <div className="flex flex-row items-center gap-2 p-3 self-end mx-auto">
        <button className="text-xs bg-gray-100 hover:bg-gray-200 p-1 px-2 rounded">
          <FiBold />
        </button>
        <button className="text-xs bg-gray-100 hover:bg-gray-200 p-1 px-2 rounded">
          <FiItalic />
        </button>

        <div className="ml-auto flex flex-row gap-2">
          <button className="text-xs bg-gray-100 hover:bg-gray-200 p-1 px-2 rounded">
            <p>Save</p>
          </button>
        </div>
      </div>
      
      <div className="flex flex-row gap-5">
        <textarea
          className="w-full h-[80vh] p-3 outline-none"
          placeholder="Write something..."
        ></textarea>
      </div>
    </div>
  );
}
