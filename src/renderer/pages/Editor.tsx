import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmptySvg from '../assets/images/empty.svg';
import useNotes from '../hooks/useNotes';
import { GoAlertFill, GoIssueClosed, GoTriangleLeft } from 'react-icons/go';

export default function Editor() {
  const { notes, handleUpdateNote } = useNotes();
  const params = useParams();
  const navigate = useNavigate();

  const note = notes.find(note=>note.id === Number(params.id));

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const timeout0 = useRef<NodeJS.Timeout | null>(null);

  const wordCount = useMemo(() => content.split(/\s+/).filter((word) => word !== '').length, [content]);
  const haveUnsavedChanges = note.title !== title || note.content !== content;
  
  useEffect(()=>{
    // auto save
    if (haveUnsavedChanges) {
      if (timeout0.current) {
        clearTimeout(timeout0.current);
      }
      timeout0.current = setTimeout(() => {
        handleUpdateNote(note.id, title, content);
      }, 1000);
    }
  },[title, content])

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#1e1e1e]">

      <div className="relative w-full text-sm mt-5">
        <div className="flex flex-col h-[100vh] overflow-y-auto">
          <div className="flex pl-3 items-center pb-3 gap-1">
            <button className="outline-none flex items-center text-xs" onClick={()=>navigate(-1)}>
              <GoTriangleLeft size={20}/>
            </button>

            <input
               type="text"
               placeholder="Title..."
               className="pr-3 outline-none font-bold text-xl bg-inherit w-full truncate"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               autoCorrect="off"
               autoComplete="off"
               spellCheck="false"
            />
          </div>

          <textarea
            className="w-full outline-none h-full px-6 bg-inherit"
            placeholder="My important note..."
            value={content}
            autoCorrect="off"
            spellCheck="false"
            autoFocus={true}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="w-full py-1 flex items-center gap-4 text-xs justify-end pr-3 fixed bottom-0 bg-gray-200 dark:bg-[#1e1e1e]">
            <p>
              <span className="font-bold">{content.length}</span> characters
            </p>
            <p>
              <span className="font-bold">{wordCount}</span> words
            </p>
            <p className={`${haveUnsavedChanges ? "bg-red-500" : "bg-green-500"} h-2 w-2 rounded-full`}></p>
          </div>
        </div>
      </div>
    </div>
  );
}
