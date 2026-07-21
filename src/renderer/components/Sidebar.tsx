import useNotes from '../hooks/useNotes';

export default function Sidebar() {
  const { notes } = useNotes();

  return (
    <div class="flex items-center h-8 m-2">
      <div className="flex items-center bg-[#1f1f1f] dark:text-white h-8 m-2 bg-opacity-40 text-xs">
        {notes.map((i) => {
          return (
            <div
              key={i.id}
              className="flex items-center gap-2 px-5 border-r border-[#3e3e3e] h-full"
            >
              <span className="font-bold truncate">{i.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
