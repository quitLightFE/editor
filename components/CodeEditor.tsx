'use client';

import Editor from '@monaco-editor/react';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';

type Props = {
  language: 'html' | 'css' | 'javascript';
  value: string;
  onChange: (value: string) => void;
};

let emmetInitialized = false;

export default function CodeEditor({ language, value, onChange }: Props) {
  function handleBeforeMount(monaco: any) {
    if (emmetInitialized) return;

    emmetHTML(monaco, ['html']);
    emmetCSS(monaco, ['css']);

    emmetInitialized = true;
  }

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      beforeMount={handleBeforeMount}
      onChange={(value: string | undefined) => onChange(value ?? '')}
      options={{
        fontSize: 14,

        minimap: {
          enabled: false,
        },

        automaticLayout: true,

        wordWrap: 'on',

        tabSize: 2,

        padding: {
          top: 12,
        },

        suggestOnTriggerCharacters: true,

        quickSuggestions: true,

        bracketPairColorization: {
          enabled: true,
        },
      }}
    />
  );
}
