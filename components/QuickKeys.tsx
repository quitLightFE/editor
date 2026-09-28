"use client";

import type { OnMount } from "@monaco-editor/react";

type Editor = Parameters<OnMount>[0];

type QuickKeysProps = {
  editor: Editor | null;
};

export default function QuickKeys({ editor }: QuickKeysProps) {
  const insert = (text: string) => {
    if (!editor) return;

    const selection = editor.getSelection();

    if (!selection) return;

    // editor.executeEdits("quick-key", [
    //   {
    //     range: selection,
    //     text,
    //     forceMoveMarkers: true,
    //   },
    // ]);

    editor.trigger("keyboard", "type", {
      text,
    });

    editor.focus();
  };

  const trigger = (command: string) => {
    if (!editor) return;

    editor.trigger("quick-key", command, null);
    editor.focus();
  };

  function selectAll() {
    const model = editor?.getModel();
    if (model) {
      // 3. Выделяем текст от начала первой строки до конца последней
      editor?.setSelection({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: model.getLineCount(),
        endColumn: model.getLineMaxColumn(model.getLineCount()),
      });
    }
  }

  const symbols = [
    "<",
    ">",
    "/",
    "=",
    '"',
    "'",
    "{",
    "}",
    "(",
    ")",
    "[",
    "]",
    ";",
    ":",
    ",",
  ];

  return (
    <div className="border-t border-zinc-700 bg-zinc-900 md:hidden overflow-x-auto">
      {/* Символы */}
      <div className="flex items-center gap-1 p-2 overflow-x-auto px-3">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            type="button"
            onClick={() => insert(symbol)}
            className="
              h-10
              min-w-10
              shrink-0
              rounded-md
              border
              border-zinc-700
              bg-zinc-800
              px-3
              font-mono
              text-sm
              text-white
              active:scale-95
              active:bg-zinc-600
            "
          >
            {symbol}
          </button>
        ))}
      </div>

      {/* Навигация */}
      <div className="flex gap-1 overflow-x-auto px-2 pb-2 justify-center items-center">
        <button
          type="button"
          onClick={selectAll}
          className="h-10 min-w-14 shrink-0 rounded-md bg-zinc-800 px-3 text-sm text-white"
        >
          All
        </button>
        <button
          type="button"
          onClick={() => trigger("tab")}
          className="h-10 min-w-14 shrink-0 rounded-md bg-zinc-800 px-3 text-sm text-white"
        >
          Tab
        </button>

        <button
          type="button"
          onClick={() => trigger("cursorLeft")}
          className="h-10 min-w-10 shrink-0 rounded-md bg-zinc-800 text-white px-2"
        >
          ←
        </button>

        <button
          type="button"
          onClick={() => trigger("cursorRight")}
          className="h-10 min-w-10 shrink-0 rounded-md bg-zinc-800 text-white px-2"
        >
          →
        </button>

        <button
          type="button"
          onClick={() => trigger("cursorUp")}
          className="h-10 min-w-10 shrink-0 rounded-md bg-zinc-800 text-white px-2"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={() => trigger("cursorDown")}
          className="h-10 min-w-10 shrink-0 rounded-md bg-zinc-800 text-white px-2"
        >
          ↓
        </button>

        <button
          type="button"
          onClick={() => trigger("undo")}
          className="h-10 min-w-12 shrink-0 rounded-md bg-zinc-800 text-white px-3"
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() => trigger("redo")}
          className="h-10 min-w-12 shrink-0 rounded-md bg-zinc-800 text-white px-3"
        >
          ↷
        </button>
      </div>
    </div>
  );
}
