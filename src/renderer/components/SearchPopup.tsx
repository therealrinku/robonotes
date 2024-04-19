import { useEffect, useMemo, useState } from 'react';
import { GoFile, GoSearch, GoX } from 'react-icons/go';
import useNotes from '../hooks/useNotes';
import useTags from '../hooks/useTags';

interface Props {
  onClose: () => void;
}

export default function SearchPopup({ onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const { notes, handleOpenNote } = useNotes();
  const { tags } = useTags();

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);
    return () => document.removeEventListener('keydown', onKeyPress);
  }, []);

  const filteredNotes = useMemo(() => {
    if (
      !Array.isArray(notes) ||
      notes.length == 0 ||
      searchQuery.trim().length === 0
    ) {
      return [];
    }

    return notes.filter((noteName) => {
      const allQueries = searchQuery.split(',').map((item) => item.trim());

      // if it has multiple queries, all needs to match aka all or nothing

      const thisNoteTags = Object.entries(tags)
        .filter((tag) => tag[1][noteName] === true)
        .map((tg) => tg[0]);

      return allQueries.every((query) => {
        if (query.startsWith('#')) {
          const tagToMatch = query.slice(1);
          return thisNoteTags.some((tag) => tag === tagToMatch);
        } else {
          return noteName.toLowerCase().includes(query.toLowerCase());
        }
      });
    });
  }, [searchQuery, notes]);

  return (
    <div
      className="fixed top-0 left-0 h-full w-full z-10"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <button className="fixed top-5 right-10" onClick={onClose}>
        <GoX color="white" size={25} />
      </button>

      <div className=" mt-5 w-96 mx-auto bg-white pt-5 rounded flex flex-col gap-5">
        <input
          placeholder="Quick Search...."
          className="bg-gray-100 mx-5 px-3 rounded text-xs py-2 outline-none focus:outline focus:outline-1 focus:outline-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2 px-5 pb-5">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((noteName: string) => {
              return (
                <button
                  key={noteName}
                  onClick={() => {
                    handleOpenNote(noteName);
                    onClose();
                  }}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded"
                >
                  <GoFile size={13} />
                  <p className="text-xs"> {noteName}</p>
                </button>
              );
            })
          ) : searchQuery.trim().length === 0 ? (
            <div className="text-xs flex flex-col gap-2">
              <p className="font-bold">Search Examples</p>
              <p className="flex items-center gap-1">
                <GoSearch /> <span>Plans</span>
              </p>
              <p className="flex items-center gap-1">
                <GoSearch /> <span>2024 Goals, #personal</span>
              </p>
              <p className="flex items-center gap-1">
                <GoSearch /> <span>Masterplan, #work, #projectname</span>
              </p>
              <p className="flex items-center gap-1">
                <GoSearch /> <span>#work, #anotherproject</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
