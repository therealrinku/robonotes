import { useState, useMemo } from 'react';
import { GoTrash, GoPlus, GoX, GoSearch } from 'react-icons/go';
import useNotes from '../hooks/useNotes';

interface Props{
  onSelectNote?:(id: number) => void
}

export default function SearchModal({onSelectNote}:Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { notes, handleCreateNewNote } = useNotes();

  const filteredNotes = useMemo(() => {
    if (
      !Array.isArray(notes) ||
      notes.length == 0 ||
      searchQuery.trim().length === 0
    ) {
      return notes;
    }

    return notes.filter((note) => {
      const allQueries = searchQuery.split(',').map((item) => item.trim());

      return allQueries.every((query) => {
        if (query.startsWith('#')) {
          const allTags = note.content
            .split(/\s+|\n+/)
            .filter((word) => word.startsWith('#'));
          return allTags.includes(query);
        } else {
          return note.content.toLowerCase().includes(query.toLowerCase());
        }
      });
    });
  }, [searchQuery, notes]);

  const widthClasses = isFocused ? 'w-[85%] md:w-[50%]' : 'w-[50%] md:w-[35%]';

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className=" w-full flex items-center gap-3 justify-between relative">
        <div className={`flex items-center mx-auto ${widthClasses} bg-gray-200 dark:bg-[#1e1e1e] h-8`}>
          <GoSearch className="absolute ml-2 " color="gray" />
          <input
            title="Search with note content or by tag name, #tagname, note content"
            className="w-full text-xs bg-gray-200 dark:bg-[#1e1e1e] px-2 pl-8 outline-none dark:text-white"
            placeholder="Search note."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <div class="flex items-center text-white h-full">
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="px-3 h-full">
                <GoX />
              </button>
            )}
            <button onClick={handleCreateNewNote} className="px-3 border-l h-full dark:border-gray-700 hover:bg-green-900">
              <GoPlus />
            </button>
            <button onClick={handleCreateNewNote} className="px-3 hover:bg-red-900 h-full dark:border-gray-700 border-l">
              <GoTrash size={11}/>
            </button>
          </div>
        </div>
      </div>

      {searchQuery.trim().length === 0 && isFocused && (
        <div className={`absolute mt-8 mx-auto text-xs dark:text-white z-50 ${widthClasses}`}>
          <div className="bg-gray-200 dark:bg-[#1e1e1e] px-3 py-2 border-gray-200 dark:border-gray-700 border-t ">
            <h4 className="text-gray-500">Recently opened</h4>
            <p>Note1</p>
          </div>
        </div>
      )}

      <div className={`absolute mt-8 w-[85%] md:w-[50%] mx-auto text-xs dark:text-white z-50 ${widthClasses}`}>
        {searchQuery.length > 0 && filteredNotes.length > 0 ? (
          <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col gap-3">
            <h4 className="text-gray-500 px-3">Results</h4>
            {filteredNotes.map((note) => {
              return (
                <button
                  onClick={() => {
                    onSelectNote?.(note.id)
                    setSearchQuery('');
                  }}
                  key={note.id}
                  className="truncate max-w-full text-left px-3"
                >
                  {note.content}
                </button>
              );
            })}
          </div>
        ) : (
          searchQuery.length > 0 && (
            <div className="bg-gray-200 dark:bg-[#1e1e1e] py-5 border-gray-200 dark:border-gray-700 border-t text-center">
              <p>No results found</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
