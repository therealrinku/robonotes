import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useTags() {
  const { tags, setTags, rootDir } = useContext(RootContext);

  function removeTagFromNote(noteName: string, tagName: string) {
    const updatedTags = { ...tags };

    //@ts-expect-error
    delete updatedTags[tagName][noteName];

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

  function addTagToNote(noteName: string, tagName: string) {
    const updatedTags = { ...tags };

    //@ts-expect-error
    updatedTags[tagName][noteName] = true;

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

  function addTag(newTagName: string) {
    const newTag = {
      [newTagName]: {},
    };

    const updatedTags = { ...tags, ...newTag };

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

  function removeTag(tagName: string) {
    const updatedTags = { ...tags };

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

  return { tags, addTag, removeTag, addTagToNote, removeTagFromNote };
}
