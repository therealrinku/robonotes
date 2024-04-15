import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useTags() {
  const { tags, setTags, rootDir } = useContext(RootContext);

  function addTag(newTagName: string) {
    const updatedTags = [...tags, newTagName];

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

  function removeTag(tagName: string) {
    const updatedTags = tags.filter((tag) => tag !== tagName);

    //@ts-expect-error
    delete updatedTags[tagName];

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

  return { tags, addTag, removeTag };
}
