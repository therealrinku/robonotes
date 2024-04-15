import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useTags() {
  const { tags, setTags, rootDir } = useContext(RootContext);

  function removeNoteFromAssociatedTags(noteName: string) {
    const updatedTags = { ...tags };

    for (let tagKey in updatedTags) {
      //@ts-expect-error
      const noteNames = updatedTags[tagKey];
      for (let nn in noteNames) {
        if (nn === noteName) {
          //@ts-expect-error
          delete updatedTags[tagKey][nn];
        }
      }
    }

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

  function moveTagToRenamedNote(lastNoteName: string, newNoteName: string) {
    const updatedTags = { ...tags };

    for (let tagKey in updatedTags) {
      //@ts-expect-error
      const noteNames = updatedTags[tagKey];
      for (let noteName in noteNames) {
        if (noteName === lastNoteName) {
          //@ts-expect-error
          delete updatedTags[tagKey][noteName];
          //@ts-expect-error
          updatedTags[tagKey][newNoteName] = true;
        }
      }
    }

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    //@ts-expect-error
    setTags(updatedTags);
  }

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

  return {
    tags,
    addTag,
    removeTag,
    addTagToNote,
    removeTagFromNote,
    moveTagToRenamedNote,
    removeNoteFromAssociatedTags,
  };
}
