"use client";

import Editor from "@monaco-editor/react";
import { emmetHTML, emmetCSS, emmetJSX } from "emmet-monaco-es";

type Props = {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (value: string) => void;
  onMount?: (editor: any) => void;
};

export default function CodeEditor({
  language,
  value,
  onChange,
  onMount,
}: Props) {
  function handleBeforeMount(monaco: any) {
    if (monaco.__emmetInitialized) return;

    emmetHTML(monaco, ["html"]);
    emmetCSS(monaco, ["css"]);
    emmetJSX(monaco, ["javascript", "typescript", "jsx", "tsx"]);

    monaco.__emmetInitialized = true;
  }

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      beforeMount={handleBeforeMount}
      onMount={onMount}
      onChange={(value: string | undefined) => onChange(value ?? "")}
      options={{
        fontSize: 14,

        automaticLayout: true,
        fixedOverflowWidgets: true,

        minimap: {
          enabled: false,
        },

        wordWrap: "on",

        tabSize: 2,

        padding: {
          top: 12,
        },

        autoClosingBrackets: "always",
        autoClosingOvertype: "always",
        autoClosingComments: "always",
        autoClosingQuotes: "always",
        autoSurround: "languageDefined",

        suggestOnTriggerCharacters: true,

        quickSuggestions: true,

        bracketPairColorization: {
          enabled: true,
        },
      }}
    />
  );
}
