'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';
import Console from '../components/Console';

type FileName = 'html' | 'css' | 'js';
type ConsoleMessage = {
  type: 'log' | 'warn' | 'error';
  args: string[];
};

const initialCode = {
  html: `<div class="container">
  <h1>Hello World!</h1>
  <p>My first code editor</p>
  <button onclick="hello()">Click me</button>
</div>`,

  css: `.container {
  padding: 30px;
  text-align: center;
}

h1 {
  color: #6366f1;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}`,

  js: `function hello() {
  console.log("Hello from JavaScript!");
}`,
};

const fileInfo = {
  html: {
    name: 'index.html',
    language: 'html' as const,
  },
  css: {
    name: 'style.css',
    language: 'css' as const,
  },
  js: {
    name: 'index.js',
    language: 'javascript' as const,
  },
};

export default function Home() {
  const [activeFile, setActiveFile] = useState<FileName>('html');

  const [files, setFiles] = useState(initialCode);

  const [isRunning, setIsRunning] = useState(false);

  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);

  const currentFile = fileInfo[activeFile];

  function updateCode(value: string) {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value,
    }));
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data || event.data.source !== 'code-editor') {
        return;
      }

      setConsoleMessages((prev) => [
        ...prev,
        {
          type: event.data.type,
          args: event.data.args,
        },
      ]);
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <main className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 shrink-0 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="font-semibold">Code Editor</div>

        <button
          onClick={() => {
            setConsoleMessages([]);
            setIsRunning(true);
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500"
        >
          ▶ Run
        </button>
      </header>

      {/* File tabs */}
      <div className="h-11 shrink-0 border-b border-zinc-800 flex items-center overflow-x-auto">
        {(Object.keys(fileInfo) as FileName[]).map((file) => {
          const active = activeFile === file;

          return (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`h-full px-5 text-sm border-r border-zinc-800 transition ${
                active
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              {fileInfo[file].name}
            </button>
          );
        })}
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Editor */}
        <div className="h-1/2 md:h-full md:w-1/2 min-h-0">
          <CodeEditor
            language={currentFile.language}
            value={files[activeFile]}
            onChange={updateCode}
          />
        </div>

        {/* Preview */}
        <div className="h-1/2 md:h-full md:w-1/2 min-h-0 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col">
          {/* Preview */}

          <div className="flex-1 min-h-0">
            {isRunning ? (
              <Preview html={files.html} css={files.css} js={files.js} />
            ) : (
              <div className="h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                <div className="text-center">
                  <div className="text-3xl mb-2">▶</div>

                  <p>Press Run to see the result</p>
                </div>
              </div>
            )}
          </div>

          {/* Console */}

          <div className="h-40 shrink-0 border-t border-zinc-800">
            <Console
              messages={consoleMessages}
              onClear={() => setConsoleMessages([])}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
