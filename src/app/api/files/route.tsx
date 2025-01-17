import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  path?: string;
  size?: number;
  children?: FileSystemItem[];
}

const getDirectoryContents = async (dirPath: string): Promise<FileSystemItem[]> => {
    const items = await fs.promises.readdir(dirPath);
    const contents: FileSystemItem[] = [];
  
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = await fs.promises.stat(fullPath);
      const relativePath = `/${path.relative(path.join(process.cwd(), 'public'), fullPath)}`.replace(/\\/g, '/');
  
      if (stats.isDirectory()) {
        contents.push({
          id: uuidv4(),
          name: item,
          type: 'folder',
          children: await getDirectoryContents(fullPath)
        });
      } else {
        contents.push({
          id: uuidv4(),
          name: item,
          type: 'file',
          mimeType: mime.lookup(item) || 'application/octet-stream',
          path: relativePath,
          size: stats.size
        });
      }
    }
  
    return contents;
  };

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const fileSystem = await getDirectoryContents(publicDir);
    
    return NextResponse.json(fileSystem);
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json(
      { message: 'Error reading directory' },
      { status: 500 }
    );
  }
}