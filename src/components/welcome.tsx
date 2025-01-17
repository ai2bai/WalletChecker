import React, { useEffect } from 'react';
interface WelcomeModalProps {
    showWelcome: boolean;
    startExperience: () => void;
  }
  const WelcomeModal: React.FC<WelcomeModalProps> = ({ showWelcome, startExperience }) => {
  useEffect(() => {
    const handleKeyPress = (event:KeyboardEvent) => {
      if (event.key === 'Enter' && showWelcome) {
        startExperience();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showWelcome, startExperience]);

  if (!showWelcome) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-black border border-[#B1B762] p-8 rounded-lg text-center max-w-md mx-4">
        <h2 className="text-2xl mb-4 text-[#B1B762]">
          welcome to ai2b OS
        </h2>
        <p className="mb-6 text-[#B1B762]">
          Press Enter or Click Enter Below to Start your Journey with different AI utilities
        </p>
        <button
          onClick={startExperience}
          className="bg-[#B1B762] text-black px-8 py-3 rounded hover:bg-opacity-80 transition-all"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;