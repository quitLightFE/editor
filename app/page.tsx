'use client';

import { useState, useEffect } from 'react';
import JSZip from 'jszip';

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

  // const [isRunning, setIsRunning] = useState(false);

  const [showConsole, setShowConsole] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const [consoleMessages, setConsoleMessages] = useState<
    ConsoleMessage[]
  >([]);

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

  function runCode() {
    setConsoleMessages([]);
    // setIsRunning(true);
  }

  function createPreviewDocument() {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${files.css}
  </style>
</head>

<body>
  ${files.html}

  <script>
    ${files.js}
  <\/script>
</body>
</html>
`;
  }

  function openPreviewWindow() {
    const blob = new Blob(
      [createPreviewDocument()],
      { type: 'text/html' }
    );

    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  }

  async function downloadCode() {
    const zip = new JSZip();

    zip.file('index.html', files.html);
    zip.file('style.css', files.css);
    zip.file('index.js', files.js);

    const blob = await zip.generateAsync({
      type: 'blob',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = 'my-code.zip';

    link.click();

    URL.revokeObjectURL(url);
  }

  function sendToTeacher() {
    // Здесь позже подключим API
    alert('Отправка учителю будет подключена позже');
  }

  return (
    <main className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">

      {/* HEADER */}

      <header className="h-14 shrink-0 border-b border-zinc-800 flex items-center justify-between px-3 md:px-4 gap-2">

        {/* Logo */}

        <div className="font-semibold whitespace-nowrap">
          Code Editor
        </div>

        {/* Actions */}

        <div className="flex items-center gap-1.5">

          {/* Run */}

          <button
            onClick={runCode}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-500"
          >
            ▶ <span className="hidden sm:inline">Run</span>
          </button>

          {/* Preview */}<button
            onClick={openPreviewWindow}
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
            title="Open preview"
          >
            ↗ <span className="hidden md:inline">Preview</span>
          </button>

          {/* Mobile preview */}

          <button
            onClick={() => setShowPreview((prev) => !prev)}
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700 md:hidden"
          >
            {showPreview ? '⌨ Editor' : '👁 Preview'}
          </button>

          {/* Download */}

          <button
            onClick={downloadCode}
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
            title="Download code"
          >
            ↓ <span className="hidden md:inline">Download</span>
          </button>

          {/* Send */}

          <button
            onClick={sendToTeacher}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm hover:bg-emerald-500"
            title="Send to teacher"
          >
            ↑ <span className="hidden md:inline">Send</span>
          </button>

        </div>
      </header>

      {/* FILE TABS */}

      <div className="h-11 shrink-0 border-b border-zinc-800 flex items-center overflow-x-auto">

        {(Object.keys(fileInfo) as FileName[]).map((file) => {
          const active = activeFile === file;

          return (
            <button
              key={file}
              onClick={() => { setActiveFile(file); setShowPreview(false) }}
              className={`
                h-full px-5 text-sm border-r border-zinc-800
                transition
                ${active
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900'
                }
              `}
            >
              {fileInfo[file].name}
            </button>
          );
        })}

      </div>

      {/* MAIN */}

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">

        {/* EDITOR */}

        <div
          className={`
            min-h-0
            w-full md:w-1/2
            h-full
            ${showPreview ? 'hidden md:block' : 'block'}
          `}
        >
          <CodeEditor
            key={activeFile}
            language={currentFile.language}
            value={files[activeFile]}
            onChange={updateCode}
          />
        </div>

        {/* PREVIEW */}

        <div
          className={`
            min-h-0
            w-full md:w-1/2
            h-full
            ${showPreview
              ? 'block'
              : 'hidden md:flex'
            }
            flex-col
            border-l border-zinc-800
          `}
        >

          {/* Preview */}

          <div className="flex-1 min-h-0">


            <Preview
            key={activeFile + "1"}
              html={files.html}
              css={files.css}
              js={files.js}
            />

            {/*             
            (
            <div className="h-[85vh] flex items-center justify-center bg-zinc-900 text-zinc-500">

              <div className="text-center">

                <div className="text-3xl mb-2">
                  ▶
                </div>

                <p>
                  Press Run to see the result
                </p>

              </div>

            </div>
            )} */}

          </div>

          {/* CONSOLE BUTTON */}

          <div className={`shrink-0 border-t border-zinc-800 bg-zinc-950 transition-all ${showConsole ? "h-40" : "h-9"}`}>

            <button
              onClick={() =>
                setShowConsole((prev) => !prev)
              }
              className="w-full h-9 px-3 flex items-center justify-between text-xs text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <span>
                Console
                {consoleMessages.length > 0 &&
                  (` ${consoleMessages.length}`)}
              </span>

              <span>
                {showConsole ? '⌄' : '⌃'}
              </span>
            </button>{showConsole && (
              <div className={`h-[calc(100%-2.25rem)] border-t border-zinc-800 ${showConsole ? "block" : "hidden"}`}>
                <Console
                  messages={consoleMessages}
                  onClear={() =>
                    setConsoleMessages([])
                  }
                />
              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}