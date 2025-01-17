import React, { useState, useRef, useEffect } from "react";
import ModalBackground from "./shared/ModalBackground";

interface HistoryItem {
  text: string;
  isCommand: boolean;
  isStreaming?: boolean;
}

interface CommandResult {
  output: string;
  isCommand: boolean;
  shouldStream?: boolean;
}

interface FileSystemNode {
  [key: string]: FileSystemNode | string;
}

interface LinuxTerminalProps {
  onClose: () => void;
}

const LinuxTerminal: React.FC<LinuxTerminalProps> = ({ onClose }) => {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      text: 'Welcome to ai2b Terminal v1.0.0\nType "help" to see available commands',
      isCommand: false,
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("/home/user");
  const [isTyping, setIsTyping] = useState(false);

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // File system structure
  const fileSystem: FileSystemNode = {
    "/": {
      home: {
        user: {
          documents: {
            "readme.txt": "Welcome to ai2b Terminal!\n2B or Not 2B.",
            "notes.txt": "Important system notes and configurations.",
            projects: {
              web: {
                "index.html": "<html><body>Hello ai2b</body></html>",
                "styles.css": "body { background: black; color: #B1B762; }"
              },
              data: {
                "stats.csv": "date,value\n2024-01-01,100\n2024-01-02,150"
              }
            }
          },
          downloads: {
            "sample.pdf": "[PDF Content]",
            "image.jpg": "[Image Content]"
          },
          ".config": {
            "settings.json": '{"theme": "dark", "font": "mono"}'
          }
        }
      },
      etc: {
        "hosts": "127.0.0.1 localhost\n192.168.1.1 router",
        "passwd": "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000::/home/user:/bin/bash"
      },
      usr: {
        bin: {
          "python": "[Binary]",
          "node": "[Binary]"
        },
        "lib": {
          "node_modules": {}
        }
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Helper function to get directory content at a specific path
  const getNodeAtPath = (path: string): FileSystemNode | string | null => {
    if (path === '/') return fileSystem['/'];
    
    const parts = path.split('/').filter(Boolean);
    // let current: FileSystemNode = fileSystem['/'];
    let current: FileSystemNode = fileSystem['/'] as FileSystemNode;
    for (const part of parts) {
      if (current[part] === undefined) return null;
      if (typeof current[part] === 'string') {
        return current[part];
      }
      current = current[part] as FileSystemNode;
    }
    
    return current;
  };

  const resolvePath = (inputPath: string): string => {
    // Handle home directory
    if (inputPath === '~' || inputPath === '') {
      return '/home/user';
    }

    // Handle relative paths
    let resolvedPath = inputPath;
    if (!inputPath.startsWith('/')) {
      resolvedPath = `${currentPath}/${inputPath}`;
    }

    // Handle .. and .
    const parts = resolvedPath.split('/').filter(Boolean);
    const resolvedParts: string[] = [];
    
    for (const part of parts) {
      if (part === '..') {
        resolvedParts.pop();
      } else if (part !== '.') {
        resolvedParts.push(part);
      }
    }

    return `/${resolvedParts.join('/')}` || '/';
  };

  const commands: { [key: string]: (args: string[]) => CommandResult } = {
    help: () => ({
      output: `Available commands:
File Operations:
  cat [file]             Display file contents
  mkdir [directory]      Create a directory
  touch [file]          Create an empty file
  rm [-r] [file/dir]    Remove file or directory (-r for recursive)
  cp [source] [dest]    Copy files

Navigation & Listing:
  pwd                   Print working directory
  ls [-l] [directory]   List directory contents
  cd [directory]        Change directory

System Information:
  date                  Show current date and time
  ps                    Show process information
  top                   Display system processes
  df                    Show disk usage
  free                  Show memory usage
  whoami               Show current user

Search & Text:
  grep [pattern] [file] Search for pattern in file
  find [path] [name]    Find files
  echo [text]          Print text

Terminal Control:
  clear                Clear terminal screen
  exit                 Exit terminal
  history              Show command history`,
      isCommand: false
    }),

    pwd: () => ({
      output: currentPath,
      isCommand: false
    }),

    ls: (args) => {
      let targetPath = currentPath;
      const nonFlagArgs = args.filter(arg => !arg.startsWith('-'));
      if (nonFlagArgs.length > 0) {
        targetPath = resolvePath(nonFlagArgs[0]);
      }

      const node = getNodeAtPath(targetPath);
      
      if (!node || typeof node === 'string') {
        return {
          output: `ls: cannot access '${targetPath}': No such directory`,
          isCommand: false
        };
      }

      const isLong = args.includes('-l');
      const contents = Object.entries(node).map(([name, content]) => {
        if (isLong) {
          const type = typeof content === 'object' ? 'd' : '-';
          const size = typeof content === 'string' ? content.length : 4096;
          const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          return `${type}rw-r--r-- 1 user user ${size.toString().padStart(8)} ${date} ${name}`;
        }
        return name;
      });

      return {
        output: isLong ? contents.join('\n') : contents.join('  '),
        isCommand: false
      };
    },

    cd: (args) => {
      const newPath = resolvePath(args[0] || '~');
      const node = getNodeAtPath(newPath);
      
      if (node && typeof node === 'object') {
        setCurrentPath(newPath);
        return { output: "", isCommand: false };
      }
      return {
        output: `cd: ${args[0] || '~'}: No such directory`,
        isCommand: false
      };
    },

    cat: (args) => {
      if (!args.length) {
        return { output: "cat: missing operand", isCommand: false };
      }

      const filePath = resolvePath(args[0]);
      const node = getNodeAtPath(filePath);

      if (node === null) {
        return {
          output: `cat: ${args[0]}: No such file or directory`,
          isCommand: false
        };
      }

      if (typeof node === 'string') {
        return { output: node, isCommand: false };
      }

      return {
        output: `cat: ${args[0]}: Is a directory`,
        isCommand: false
      };
    },

    date: () => ({
      output: new Date().toString(),
      isCommand: false
    }),

    ps: () => ({
      output: `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  943 ?        00:00:00 sshd
 1020 pts/0    00:00:00 bash
 1255 pts/0    00:00:00 ps`,
      isCommand: false
    }),

    top: () => ({
      output: `top - ${new Date().toLocaleTimeString()}
Tasks: 128 total,   1 running, 127 sleeping
%Cpu(s):  2.4 us,  1.2 sy,  0.0 ni, 96.3 id
MiB Mem :  16384.0 total,   8192.0 free,   4096.0 used
MiB Swap:   8192.0 total,   8192.0 free,      0.0 used

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1255 user      20   0   10256   3756   3144 R   0.3   0.1   0:00.01 top
    1 root      20   0  169992  11784   8376 S   0.0   0.1   0:02.34 systemd
  943 root      20   0   12672   6940   6044 S   0.0   0.0   0:00.00 sshd`,
      isCommand: false
    }),

    df: () => ({
      output: `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1      41251136  12648444  26531788  33% /
tmpfs           8192000         0   8192000   0% /tmp
/dev/sdb1     120034544  82544248  31388040  73% /data`,
      isCommand: false
    }),

    free: () => ({
      output: `               total        used        free      shared  buff/cache   available
Mem:        16384000     4521432     8631244      427128     3231324    11058512
Swap:        8192000      124568     8067432`,
      isCommand: false
    }),

    whoami: () => ({
      output: "user",
      isCommand: false
    }),

    find: (args) => {
      if (!args.length) {
        return { output: "find: missing operand", isCommand: false };
      }

      const searchPath = resolvePath(args[0]);
      const node = getNodeAtPath(searchPath);

      if (!node) {
        return {
          output: `find: '${args[0]}': No such file or directory`,
          isCommand: false
        };
      }

      const pattern = args[1] || "*";
      const results: string[] = [];

      const searchFiles = (node: FileSystemNode | string, path: string) => {
        if (typeof node === 'string') {
          if (pattern === "*" || path.includes(pattern)) {
            results.push(path);
          }
        } else {
          Object.entries(node).forEach(([name, content]) => {
            searchFiles(content, `${path}/${name}`);
          });
        }
      };

      searchFiles(node, searchPath);
      return {
        output: results.join('\n') || "No matches found",
        isCommand: false
      };
    },

    grep: (args) => {
      if (args.length < 2) {
        return { output: "grep: missing operand", isCommand: false };
      }

      const [pattern, filePath] = args;
      const resolvedPath = resolvePath(filePath);
      const node = getNodeAtPath(resolvedPath);

      if (!node) {
        return {
          output: `grep: ${filePath}: No such file or directory`,
          isCommand: false
        };
      }

      if (typeof node !== 'string') {
        return {
          output: `grep: ${filePath}: Is a directory`,
          isCommand: false
        };
      }

      const matches = node
        .split('\n')
        .map((line, i) => line.includes(pattern) ? `${i + 1}: ${line}` : null)
        .filter(Boolean);

      return {
        output: matches.length ? matches.join('\n') : `No matches found for '${pattern}'`,
        isCommand: false
      };
    },

    clear: () => {
      setHistory([]);
      return { output: "", isCommand: false };
    },

    exit: () => {
      onClose();
      return { output: "Exiting terminal...", isCommand: false };
    },

    mkdir: (args) => {
      if (!args.length) {
        return { output: "mkdir: missing operand", isCommand: false };
      }

      // In a real implementation, this would create the directory
      return {
        output: `Created directory: ${args[0]}`,
        isCommand: false
      };
    },

    touch: (args) => {
      if (!args.length) {
        return { output: "touch: missing operand", isCommand: false };
      }

      // In a real implementation, this would create the file
      return { output: "", isCommand: false };
    },

    echo: (args) => ({
      output: args.join(" "),
      isCommand: false
    }),

    history: () => ({
      output: history
        .filter(item => item.isCommand)
        .map(item => item.text)
        .join("\n"),
      isCommand: false
    })
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isTyping) {
      e.preventDefault();

      const trimmedCommand = currentCommand.trim();
      if (!trimmedCommand) return;

      const [cmd, ...args] = trimmedCommand.split(" ");
      setHistory((prev) => [...prev, { text: `${currentPath}$ ${trimmedCommand}`, isCommand: true }]);

      const command = commands[cmd];
      if (command) {
        const result = command(args);
        if (result.output) {
          setHistory((prev) => [...prev, { text: result.output, isCommand: false }]);
        }
      } else {
        setHistory((prev) => [
          ...prev,
          { text: `Command not found: ${cmd}. Type 'help' for available commands.`, isCommand: false }
        ]);
      }

      setCurrentCommand("");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-[800px] h-[600px] flex items-center justify-center">
   

        <div className="text-[#B1B762] w-[800px] h-[600px] flex flex-col rounded-lg z-50">
          <div className="flex items-center justify-between p-2 border-b border-[#B1B762]">
            <span className="font-mono text-sm">ai2b Terminal</span>
            <div className="flex items-center gap-4">
              <span className="text-xs">{new Date().toLocaleTimeString()}</span>
              <button
                onClick={onClose}
                className="text-[#B1B762] hover:text-[#B1B762]/80 transition-colors text-xl px-2"
                >
                ×
              </button>
            </div>
          </div>
          <div 
            ref={terminalRef} 
            className="flex-1 overflow-y-auto font-mono p-4 text-sm"
            >
            {history.map((entry, i) => (
              <div 
                key={i} 
                className="whitespace-pre-wrap mb-1"
              >
                {entry.text}
              </div>
            ))}
          </div>
          <div className="flex items-center font-mono px-4 pb-4 pt-2 border-t border-[#B1B762]">
            <span className="text-sm">{currentPath}$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent border-none outline-none ml-2 text-[#B1B762] text-sm"
              placeholder="Type 'help' for available commands"
              autoFocus
              disabled={isTyping}
            />
          </div>
        </div>
      <div className="absolute inset-0">
          <ModalBackground />
        </div>
      </div>
              </div>
              
              </div>
    </div>
  );
};

export default LinuxTerminal;