import { useContext } from 'react';
import { RootContext } from '../context/RootContext';

export default function useTags() {
  const { tags, setTags, rootDir } = useContext(RootContext);

  function removeNoteFromAssociatedTags(noteName: string) {
    const updatedTags = { ...tags };

    for (let tagKey in updatedTags) {
      const noteNames = updatedTags[tagKey];
      for (let nn in noteNames) {
        if (nn === noteName) {
          delete updatedTags[tagKey][nn];
        }
      }
    }

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    setTags(updatedTags);
  }

  function moveTagToRenamedNote(lastNoteName: string, newNoteName: string) {
    const updatedTags = { ...tags };

    for (let tagKey in updatedTags) {
      const noteNames = updatedTags[tagKey];
      for (let noteName in noteNames) {
        if (noteName === lastNoteName) {
          delete updatedTags[tagKey][noteName];
          updatedTags[tagKey][newNoteName] = true;
        }
      }
    }

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    setTags(updatedTags);
  }

  function removeTagFromNote(noteName: string, tagName: string) {
    const updatedTags = { ...tags };

    delete updatedTags[tagName][noteName];

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

    setTags(updatedTags);
  }

  function addTagToNote(noteName: string, tagName: string) {
    const updatedTags = { ...tags };

    updatedTags[tagName][noteName] = true;

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

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

    setTags(updatedTags);
  }

  function removeTag(tagName: string) {
    const updatedTags = { ...tags };

    delete updatedTags[tagName];

    window.electron.ipcRenderer.sendMessage(
      'update-tags',
      rootDir,
      updatedTags,
    );

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
