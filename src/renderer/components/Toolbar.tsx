import { useState, useMemo } from 'react';
import { GoStack, GoTag, GoTypography, GoTrash, GoPlus, GoX, GoSearch } from 'react-icons/go';
import useNotes from '../hooks/useNotes';

interface Props{
  selectedNote: any,
  onSelectNote?:(id: number) => void
}

export default function Toolbar({selectedNote, onSelectNote}:Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { notes, handleCreateNewNote } = useNotes();
  const content = selectedNote?.content || '';

  const wordCount = useMemo(
    () => content.split(/\s+/).filter((word) => word !== '').length,
    [content],
  );
  const tagsCount = useMemo(
    () =>
      content.split(/\s+|\n+/).filter((word) => word.startsWith('#')).length,
    [content],
  );


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

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center bg-gray-200 dark:bg-[#1e1e1e] h-8">
          <GoSearch className="absolute ml-2 " color="gray" />
          <input
            title="Search with note content or by tag name, #tagname, note content"
            className="w-full text-xs bg-gray-200 dark:bg-[#1e1e1e] px-2 pl-8 outline-none dark:text-white h-full"
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
          </div>
        </div>

           <div className="flex items-center  text-xs justify-end bg-gray-100 dark:bg-[#1e1e1e] dark:text-white h-8">
            <p className="flex items-center gap-2 px-3 border-r dark:border-gray-700 h-full" title={`${content.length} characters`}>
              <span className="font-bold">{content.length}</span> <GoTypography/>
            </p>
            <p className="flex items-center gap-2 px-3 dark:border-gray-700 h-full"  title={`${wordCount} words`}>
              <span className="font-bold">{wordCount}</span> <GoStack/>
            </p>
            <p className="flex items-center gap-2 px-3 border-l dark:border-gray-700 h-full" title={`${tagsCount} tags`}>
              <span className="font-bold">{tagsCount}</span> <GoTag/>
            </p>
            <button onClick={handleCreateNewNote} className="px-3 hover:bg-red-900 h-full dark:border-gray-700 border-l">
              <GoTrash size={11}/>
            </button>
          </div>
      </div>

      {searchQuery.trim().length === 0 && isFocused && (
        <div className='absolute mt-8 w-[100%] left-0 right-0 text-xs dark:text-white z-50'>
          <div className="bg-gray-200 dark:bg-[#1e1e1e] px-3 py-2 border-gray-200 dark:border-gray-700 border-t ">
            <h4 className="text-gray-500">Recently opened</h4>
            <p>Note1</p>
          </div>
        </div>
      )}

      <div className='absolute left-0 right-0 mt-8 mx-auto text-xs dark:text-white z-50'>
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
