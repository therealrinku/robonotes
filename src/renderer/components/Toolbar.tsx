import { useState, useMemo } from 'react';
import {
  GoStack,
  GoTag,
  GoTypography,
  GoTrash,
  GoPlus,
  GoX,
  GoSearch,
} from 'react-icons/go';
import useNotes from '../hooks/useNotes';

export default function Toolbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const {
    notes,
    setOpenNote,
    handleCreateNewNote,
    handleDeleteNote,
    openNote,
    recentNotesId,
  } = useNotes();

  const charCount = openNote?.content?.length;

  const wordCount = useMemo(
    () => openNote?.content?.split(/\s+/).filter((word) => word !== '').length,
    [openNote?.content],
  );
  const tagsCount = useMemo(
    () =>
      openNote?.content?.split(/\s+|\n+/).filter((word) => word.startsWith('#'))
        .length,
    [openNote?.content],
  );

  const recentNotes = notes.filter((note) => recentNotesId.includes(note.id));

  const foundInNote = useMemo(() => {
    if (!openNote) return false;
    if (!searchQuery || searchQuery.trim() === '') return false;

    let startIndex = 0;
    const matches = [];

    while (true) {
      const index = openNote.content.indexOf(searchQuery, startIndex);

      if (index === -1) break;
      const textBefore = openNote.content.substring(0, index);
      const lineNumber = textBefore.split('\n').length;
      matches.push({ index, lineNumber });
      startIndex = index + searchQuery.length;
    }

    return matches;
  }, [openNote, searchQuery]);

  const filteredNotes = useMemo(() => {
    if (notes.length == 0 || searchQuery.trim().length === 0) {
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
        } else {
          return note.content.toLowerCase().includes(query.toLowerCase());
        }
      });
    });
  }, [searchQuery, notes]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center justify-between gap-2 w-[60%]">
        <div className="flex items-center bg-gray-200 dark:bg-[#1e1e1e] h-8 w-full">
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
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 h-full"
              >
                <GoX />
              </button>
            )}
            <button
              onClick={handleCreateNewNote}
              className="px-3 border-l h-full dark:border-gray-700 hover:bg-green-900"
            >
              <GoPlus />
            </button>
          </div>
        </div>

        <div className="flex items-center  text-xs justify-end bg-gray-100 dark:bg-[#1e1e1e] dark:text-white h-8">
          {openNote && (
            <>
              <div
                className="flex items-center gap-2 px-3 border-r dark:border-gray-700 h-full"
                title={`${charCount} characters`}
              >
                <span className="font-bold">{charCount}</span> <GoTypography />
              </div>
              <div
                className="flex items-center gap-2 px-3 dark:border-gray-700 h-full"
                title={`${wordCount} words`}
              >
                <span className="font-bold">{wordCount}</span> <GoStack />
              </div>
              <div
                className="flex items-center gap-2 px-3 border-l dark:border-gray-700 h-full"
                title={`${tagsCount} tags`}
              >
                <span className="font-bold">{tagsCount}</span> <GoTag />
              </div>
            </>
          )}
          <button
            onClick={() => handleDeleteNote(openNote?.id)}
            className="px-3 hover:bg-red-900 h-full dark:border-gray-700 border-l"
          >
            <GoTrash size={11} />
          </button>
        </div>
      </div>

      <div className="absolute mt-8 w-[60%] text-xs dark:text-white z-90 max-h-[500px] overflow-y-auto">
        {searchQuery.length === 0 && isFocused && recentNotes.length > 0 && (
          <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col">
            <h4 className="text-gray-500 px-3 pb-2">Recently opened</h4>
            {recentNotes.map((note) => {
              return (
                <button
                  onClick={() => {
                    setOpenNote(note);
                    setSearchQuery('');
                  }}
                  key={note.id}
                  className="truncate max-w-full text-left px-3 hover:bg-gray-700 py-2"
                >
                  {note.content || '(no content)'}
                </button>
              );
            })}
          </div>
        )}

        {foundInNote.length > 0 && (
          <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col">
            <h4 className="text-gray-500 px-3 pb-2">Found in this note</h4>
            {foundInNote.map((match) => {
              return (
                <button
                  onClick={() => {
                    const textarea = document.getElementById('editor');
                    if (!textarea) return;
                    textarea.setSelectionRange(
                      match.index,
                      match.index + searchQuery.length,
                    );
                    textarea.focus();

                    const selectionStart = textarea.selectionStart;

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
                    const textBeforeSelection = textarea.value.substring(
                      0,
                      selectionStart,
                    );
                    div.textContent = textBeforeSelection;

                    // Append to body to get computed dimensions
                    document.body.appendChild(div);
                    const selectionBottom = div.offsetHeight; // The pixel height before the selection starts
                    document.body.removeChild(div); // Clean up the temporary element

                    // Scroll to the calculated position
                    // We subtract a small amount to make sure the selection is fully visible, not just the very top
                    textarea.scrollTop =
                      selectionBottom - textarea.clientHeight / 2;
                  }}
                  key={match.index}
                  className="truncate max-w-full text-left px-3 hover:bg-gray-700 py-2"
                >
                  {searchQuery} at {match.lineNumber}:{match.index}
                </button>
              );
            })}
          </div>
        )}

        {searchQuery.length > 0 && filteredNotes.length > 0 ? (
          <div className="bg-gray-200 dark:bg-[#1e1e1e] py-2 border-gray-200 dark:border-gray-700 border-t flex flex-col">
            <h4 className="text-gray-500 px-3 pb-2">Notes</h4>
            {filteredNotes.map((note) => {
              return (
                <button
                  onClick={() => {
                    setOpenNote(note);
                    setSearchQuery('');
                  }}
                  key={note.id}
                  className="truncate max-w-full text-left px-3 hover:bg-gray-700 py-2"
                >
                  {note.content || '(no content)'}
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
