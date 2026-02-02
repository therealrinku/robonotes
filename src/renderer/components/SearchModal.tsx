import { useState, useMemo } from 'react';
import {
  GoX,
  GoSearch,
  GoPlus,
  GoTrash,
  GoNote,
  GoHistory,
} from 'react-icons/go';
import useNotes from '../hooks/useNotes';

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    notes,
    recentNotesId,
    openNote,
    setOpenNote,
    handleCloseNote,
    handleDeleteNote,
    handleCreateNewNote,
  } = useNotes();

  const recentNotes = notes.filter((note) => recentNotesId.includes(note.id));

  const foundInNote = useMemo(() => {
    if (!openNote) return [];
    if (!searchQuery || searchQuery.trim() === '') return [];

    let startIndex = 0;
    const matches = [];
    let keepSearching = true;

    while (keepSearching) {
      const index = openNote.content.indexOf(searchQuery, startIndex);

      if (index === -1) {
        keepSearching = false;
        break;
      }

      const textBefore = openNote.content.substring(0, index);
      const lineNumber = textBefore.split('\n').length;
      matches.push({ index, lineNumber });
      startIndex = index + searchQuery.length;
    }

    return matches;
  }, [openNote, searchQuery]);

  const filteredNotes = useMemo(() => {
    if (notes.length === 0 || searchQuery.trim().length === 0) {
      return notes;
    }

    if (notes.length > 0 && searchQuery.trim() === '') {
      return notes.filter((note) => note.content.trim() === '');
    }

    return notes.filter((note) => {
      const allQueries = searchQuery.split(',').map((item) => item.trim());

      return allQueries.every((query) => {
        if (query.startsWith('#')) {
          const allTags = note.content
            .split(/\s+|\n+/)
            .filter((word) => word.startsWith('#'));
          return allTags.includes(query);
        }

        return note.content.toLowerCase().includes(query.toLowerCase());
      });
    });
  }, [searchQuery, notes]);

  function goToFoundText(match: { index: number }) {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    if (!textarea) return;

    textarea.setSelectionRange(match.index, match.index + searchQuery.length);
    textarea.focus();

    const { selectionStart } = textarea;

    // Create a temporary, hidden element to measure text height
    const div = document.createElement('div');

    div.style.visibility = 'hidden';
    div.style.position = 'absolute';
    div.style.whiteSpace = 'pre-wrap';
    // It's crucial to copy all relevant styling for accurate measurement
    div.style.font = window.getComputedStyle(textarea).font;
    div.style.width = window.getComputedStyle(textarea).width;
    div.style.height = 'auto'; // Let height be determined by content

    // Text up to the selection start
    const textBeforeSelection = textarea.value.substring(0, selectionStart);
    div.textContent = textBeforeSelection;

    // Append to body to get computed dimensions
    document.body.appendChild(div);
    // The pixel height before the selection starts
    const selectionBottom = div.offsetHeight;
    document.body.removeChild(div); // Clean up the temporary element

    // Scroll to the calculated position
    // We subtract a small amount to make sure the selection is fully visible, not just the very top
    textarea.scrollTop = selectionBottom - textarea.clientHeight / 2;
  }

  return (
    <div className="fixed w-full">
      <div
        className="fixed w-full h-full bg-zinc-600 bg-opacity-80"
        onClick={onClose}
      ></div>

      <div className="flex flex-col w-[60%] mx-auto z-50 mt-2">
        <div className="flex items-center bg-gray-200 dark:bg-[#1e1e1e] h-9 w-full z-50 ">
          <GoSearch className="absolute ml-2 " color="gray" />

          <input
            title="Search for note content or other notes"
            className="w-full text-xs bg-gray-200 dark:bg-[#1e1e1e] px-2 pl-8 outline-none dark:text-white h-full"
            placeholder="Search..."
            value={searchQuery}
            autoFocus={true}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center text-white h-full">
            <button
              title="New note"
              onClick={handleCreateNewNote}
              className="hover:bg-gray-500 h-full px-2"
            >
              <GoPlus size={17} />
            </button>

            {openNote && (
              <>
                <button
                  title="Delete current note"
                  onClick={() => handleDeleteNote(openNote.id)}
                  className="hover:bg-red-500 h-full px-2"
                >
                  <GoTrash size={13} />
                </button>

                <button
                  title="Close current note"
                  onClick={handleCloseNote}
                  className="hover:bg-gray-500 h-full px-2"
                >
                  <GoX size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="dark:border-gray-700 border-t absolute mt-7 w-[60%] text-xs dark:text-white z-90 max-h-[500px] overflow-y-auto pt-2">
          {searchQuery.length === 0 && recentNotes.length > 0 && (
            <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 flex flex-col">
              {recentNotes.map((note) => {
                return (
                  <button
                    onClick={() => {
                      setOpenNote(note);
                      onClose();
                    }}
                    key={note.id}
                    className="text-left px-3 hover:bg-gray-500 py-2 flex items-center gap-2"
                  >
                    <GoHistory size={13} />

                    <p className="max-w-[95%] truncate">
                      {note.content || '(no content)'}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {foundInNote.length > 0 && (
            <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col">
              {foundInNote.map((match) => {
                return (
                  <button
                    onClick={() => goToFoundText(match)}
                    key={match.index}
                    className="text-left px-3 hover:bg-gray-500 py-2 flex items-center gap-2"
                  >
                    <GoNote size={13} />

                    <p className="max-w-[95%] truncate">
                      {searchQuery} at {match.lineNumber}:{match.index}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {searchQuery.length > 0 && filteredNotes.length > 0 ? (
            <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col">
              {filteredNotes.map((note) => {
                return (
                  <button
                    onClick={() => {
                      setOpenNote(note);
                      onClose();
                    }}
                    key={note.id}
                    className="text-left px-3 hover:bg-gray-500 py-2 flex items-center gap-2"
                  >
                    <GoSearch size={13} />

                    <p className="max-w-[95%] truncate">
                      {note.content || '(no content)'}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            searchQuery.length > 0 && (
              <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col">
                <h4 className="text-gray-500 px-3 pb-1">No result found</h4>

                <button
                  onClick={() => {
                    handleCreateNewNote(searchQuery);
                    onClose();
                  }}
                  className="text-left px-3 hover:bg-gray-500 py-2 flex items-center gap-2"
                >
                  <GoPlus size={14} />
                  <p className="max-w-[95%] truncate">
                    Create new note with {searchQuery}
                  </p>
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
