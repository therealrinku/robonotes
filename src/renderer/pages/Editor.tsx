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

  const wordCount = useMemo(() => content.split(/\s+/).filter((word) => word !== '').length, [content]);
  const haveUnsavedChanges = note.title !== title || note.content !== content;
  
  function handleSaveOnCtrlS(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 's' && haveUnsavedChanges) {
      handleUpdateNote(note.id, note.title, note.content);
    }
  }

  useEffect(()=>{
    // auto save
    const timeout0 = useRef<NodeJS.Timeout | null>(null);
    function handleAutoSaveDescription(_description: string) {
      if (haveUnsavedChanges) {
        if (timeout0.current) {
          clearTimeout(timeout0.current);
        }

        timeout0.current = setTimeout(() => {
          haveUnsavedChanges && handleUpdateNote(note.id, note.title, note.content);
        }, 1000);
      }
    }
  },[title, content])

  useEffect(() => {
    document.addEventListener('keydown', handleSaveOnCtrlS);
    return () => document.removeEventListener('keydown', handleSaveOnCtrlS);
  }, []);

  return (
    <div className="w-full max-h-[100vh] overflow-hidden bg-white dark:bg-[#1e1e1e]">
      <button className="px-4 outline-none pt-5 pb-3 flex items-center text-xs" onClick={()=>navigate(-1)}>
         <GoTriangleLeft size={18}/>
         Back
      </button>

      <div className="relative w-full text-sm">
        <div className="flex flex-col h-[100vh] overflow-y-auto">
          <input
             type="text"
             placeholder="Title..."
             className={`px-3 pb-3 outline-none font-bold text-xl w-[85%] ml-3 bg-inherit ${!isUpdatedTitleValid && 'text-red-500'}`}
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             autoCorrect="off"
             autoComplete="off"
             spellCheck="false"
          />

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
            <p className={`${haveUnsavedChanges ? "bg-red-500" : "bg-green-500"} h-3 w-3 rounded-full`}></p>
          </div>
        </div>
      </div>
    </div>
  );
}
