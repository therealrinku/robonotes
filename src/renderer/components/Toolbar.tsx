import { useMemo } from 'react';
import { GoBold, GoTag, GoTypography } from 'react-icons/go';
import useNotes from '../hooks/useNotes';

export default function Toolbar() {
  const { openNote } = useNotes();

  const charCount = openNote?.content?.length || 0;

  const wordCount = useMemo(
    () =>
      openNote?.content?.split(/\s+/).filter((word) => word !== '').length || 0,
    [openNote?.content],
  );
  const tagsCount = useMemo(
    () =>
      openNote?.content?.split(/\s+|\n+/).filter((word) => word.startsWith('#'))
        .length || 0,
    [openNote?.content],
  );

  if (!openNote) {
    return null;
  }

  const info = [
    {
      name: 'character count',
      count: charCount,
      formatted: new Intl.NumberFormat('en-US').format(charCount),
      icon: <GoBold />,
    },
    {
      name: 'words count',
      count: wordCount,
      formatted: new Intl.NumberFormat('en-US').format(wordCount),
      icon: <GoTypography />,
    },
    {
      name: 'tags count',
      count: tagsCount,
      formatted: new Intl.NumberFormat('en-US').format(tagsCount),
      icon: <GoTag />,
    },
  ];

  return (
    <div className="flex items-center bg-gray-100 dark:bg-[#1f1f1f] dark:text-white h-8 m-2">
      {info.map((i) => {
        return (
          <div
            key={i.name}
            className="flex items-center gap-2 px-3 border-r dark:border-gray-800 h-full"
            title={`Total number of ${i.name}`}
          >
            <span className="font-bold">{i.count}</span>
            {i.icon}
          </div>
        );
      })}
    </div>
  );
}
