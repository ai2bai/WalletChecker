import React, { useState, useEffect } from 'react';
import { Folder, File, Image, Music, Video, Download, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import ModalBackground from "./shared/ModalBackground";

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  path?: string;
  size?: number;
  children?: FileSystemItem[];
}

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clickPosition?: { x: number; y: number } | null;
}

interface PreviewModalProps {
  file: FileSystemItem | null;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');

  const handleDownload = () => {
    if (file.path) {
      const link = document.createElement('a');
      link.href = file.path;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNew = () => {
    if (file.path) {
      window.open(file.path, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black border border-[#B1B762] rounded-lg shadow-lg max-w-[80vw] max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#B1B762]">
          <h3 className="text-lg font-semibold text-[#B1B762]">{file.name}</h3>
          <button 
            onClick={onClose}
            className="text-[#B1B762] hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex flex-col items-center p-4">
          {isImage && (
            <img 
              src={file.path} 
              alt={file.name}
              className="max-w-[500px] object-contain"
            />
          )}
          
          {isVideo && (
            <video 
              controls 
              className="max-w-full max-h-[60vh]"
            >
              <source src={file.path} type={file.mimeType} />
              Your browser does not support the video tag.
            </video>
          )}
          
          {isAudio && (
            <div className="flex flex-col items-center gap-4">
              <audio controls>
                <source src={file.path} type={file.mimeType} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-[#B1B762]">
          <button
            onClick={handleOpenInNew}
            className="flex items-center gap-2 px-3 py-1 text-sm text-[#B1B762] hover:bg-[#B1B762] hover:bg-opacity-20 rounded transition-colors"
          >
            <ExternalLink size={16} />
            Open in New Tab
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1 text-sm text-[#B1B762] hover:bg-[#B1B762] hover:bg-opacity-20 rounded transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

const getFileIcon = (mimeType: string | undefined) => {
  if (!mimeType) return <File size={16} />;
  if (mimeType.startsWith('image/')) return <Image size={16} />;
  if (mimeType.startsWith('video/')) return <Video size={16} />;
  if (mimeType.startsWith('audio/')) return <Music size={16} />;
  return <File size={16} />;
};

const FileSystemItem = ({ 
  item, 
  depth = 0,
  onFileClick
}: { 
  item: FileSystemItem; 
  depth?: number;
  onFileClick: (file: FileSystemItem) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };


const toggleFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'file') {
      onFileClick(item);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.path) {
      const link = document.createElement('a');
      link.href = item.path;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.path) {
      window.open(item.path, '_blank');
    }
  };
  return (
    <div className="text-[#B1B762]">
      <div 
        className="flex items-center gap-2 p-2 hover:bg-[#B1B762] hover:bg-opacity-10 rounded cursor-pointer"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={item.type === 'folder' ? toggleFolder : handleClick}
      >
        {item.type === 'folder' && (
          isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        )}
        {item.type === 'folder' ? (
          <Folder size={16} />
        ) : (
          getFileIcon(item.mimeType)
        )}
        <span className="text-sm flex-1">{item.name}</span>
        {item.type === 'file' && (
          <span className="text-xs opacity-70">{formatFileSize(item.size)}</span>
        )}
      </div>
      
      {isOpen && item.children && (
        <div>
          {item.children.map(child => (
            <FileSystemItem 
              key={child.id} 
              item={child} 
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderModal = ({ isOpen, onClose, title, clickPosition }: FolderModalProps) => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null);

  useEffect(() => {
    const loadFileSystem = async () => {
      try {
        const response = await fetch('/api/files', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load file system');
        }
        
        const files = await response.json();
        setFileSystem(files);
      } catch (error) {
        console.error('Error loading file system:', error);
      }
    };

    if (isOpen) {
      loadFileSystem();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-[800px] h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <ModalBackground />
        </div>

        <div 
          className="relative bg-dark-2 rounded-lg w-full h-full overflow-hidden"
          style={{
            transform: clickPosition 
              ? `translate(${clickPosition.x}px, ${clickPosition.y}px) scale(1)`
              : 'scale(1)',
            opacity: 1,
            transition: 'all 0.3s ease-out'
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#B1B762]">
            <h2 className="text-lg font-bold text-[#B1B762]">{title}</h2>
            <button 
              onClick={onClose}
              className="text-[#B1B762] hover:text-white transition-colors text-xl"
            >
              ×
            </button>
          </div>

          <div className="h-[calc(100%-88px)] overflow-y-auto">
            <div className="p-4">
              {fileSystem.map(item => (
                <FileSystemItem 
                  key={item.id} 
                  item={item}
                  onFileClick={setSelectedFile}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-4 py-2 border-t border-[#B1B762] bg-dark-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-[#B1B762] hover:bg-[#B1B762] hover:bg-opacity-20 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {selectedFile && (
        <PreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default FolderModal;