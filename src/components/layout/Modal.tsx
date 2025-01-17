import React, { useEffect, useState } from "react";
import ModalBackground from "../shared/ModalBackground";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  clickPosition:
    | {
        x: number;
        y: number;
      }
    | null
    | undefined;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  clickPosition,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setShowContent(true);
      });
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const origin = clickPosition
    ? `${clickPosition.x}px ${clickPosition.y}px`
    : "center center";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-300 ease-in-out `}
        onClick={onClose}
      />

      {/* Modal container with optimized mobile layout */}
      <div
        className={`relative transition-all  p-4 duration-300 ease-out
          w-[98%] sm:w-[min(1000px,95vw)] h-[98%] sm:h-auto
          ${
            showContent
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        style={{
          transformOrigin: origin,
          willChange: "transform, opacity",
          aspectRatio: window.innerWidth >= 640 ? "1439/773" : "auto", // Apply aspect ratio only on desktop
        }}
      >
        {/* SVG Background */}
        <div className="absolute inset-0 w-full h-full">
          <ModalBackground />
        </div>

        {/* Content area */}
        <div className="relative h-full flex flex-col p-3 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="bg-[#B1B762] px-3 sm:px-6 py-1 sm:py-2 clip-path-hex">
              <h2
                className={`text-base sm:text-xl text-black font-bold transition-all duration-300
                ${
                  showContent
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#B1B762] hover:text-white transition-colors duration-200
                w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-[#B1B762]
                hover:bg-[#B1B762]"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className={`flex-1 overflow-auto custom-scrollbar pr-2 sm:pr-4
              transition-all duration-300 delay-150 text-sm sm:text-base
              ${
                showContent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
