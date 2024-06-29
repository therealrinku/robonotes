import SimpleUiSvg from '../assets/images/simple-ui.svg';
import PrivacySvg from '../assets/images/privacy.svg';
import FileSvg from '../assets/images/file.svg';
import HashtagSvg from '../assets/images/hashtags.svg';
import { useState } from 'react';
import useDir from '../hooks/useDir';

export default function InitialSetup() {
  const [step, setStep] = useState(1);

  const getStep = () => {
    switch (step) {
      case 1:
        return <FirstCard />;
      case 2:
        return <SecondCard />;
      case 3:
        return <ThirdCard />;
      case 4:
        return <FourthCard />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white dark:bg-[#1e1e1e] dark:text-white">
      {getStep()}

      <div className="flex flex-row items-center gap-2">
        {/* {step > 1 && (
          <button
            onClick={() => setStep((prev) => prev - 1)}
            className="mt-5 text-xs bg-gray-200 dark:bg-[#252526] hover:bg-gray-300 py-2 px-5 rounded"
          >
            Prev
          </button>
        )} */}

        {step < 4 && (
          <button
            onClick={() => setStep((prev) => prev + 1)}
            className="mt-5 text-xs bg-gray-200 dark:bg-[#252526] hover:bg-gray-300 py-2 px-5 rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function FirstCard() {
  return (
    <div className="flex text-sm flex-col items-center gap-2">
      <img src={SimpleUiSvg} alt="Simple UI" className="w-72 h-72" />
      <p className="font-bold">Simple and Intiutive UI</p>
      <p>Clutter free and minimal UI for peace of mind</p>
    </div>
  );
}

function SecondCard() {
  return (
    <div className="flex text-sm flex-col items-center gap-2">
      <img src={PrivacySvg} alt="Simple UI" className="w-72 h-72" />
      <p className="font-bold">Privacy Focused</p>
      <p>We save your files locally, no cloud sync no bullshit!</p>
    </div>
  );
}

function ThirdCard() {
  return (
    <div className="flex text-sm flex-col items-center gap-2">
      <img src={HashtagSvg} alt="Simple UI" className="w-72 h-72" />
      <p className="font-bold">Hashtags based</p>
      <p className="text-center">
        No crazy nested folder structure, <br />
        just a bunch of hashtags for categorizing notes.
      </p>
    </div>
  );
}

function FourthCard() {
  const { rootDir, handleChangeDir } = useDir();

  return (
    <div className="flex text-sm flex-col items-center gap-2">
      <img src={FileSvg} alt="Simple UI" className="w-72 h-72" />
      <p className="font-bold">Select your folder</p>
      <p className="text-center">
        Select the folder where you want to save all of your notes. <br />
        This can be changed later!
      </p>

      <div className="flex flex-row items-center gap-2">
        <button
          onClick={handleChangeDir}
          className="mt-5 text-xs bg-gray-200 dark:bg-[#252526] hover:bg-gray-300 py-2 px-5 rounded"
        >
          {rootDir ? 'Change Folder' : 'Select Folder'}
        </button>

        {rootDir && (
          <button className="mt-5 text-xs bg-gray-200 dark:bg-[#252526] hover:bg-gray-300 py-2 px-5 rounded">
            Continue...
          </button>
        )}
      </div>

      {rootDir && <p className="text-xs">Selected Folder: {rootDir}</p>}
    </div>
  );
}
