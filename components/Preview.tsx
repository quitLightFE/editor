'use client';

type PreviewProps = {
  html: string;
  css: string;
  js: string;
};

export default function Preview({ html, css, js }: PreviewProps) {
  const srcDoc = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">

  <style>
    ${css}
  </style>
</head>

<body>

  ${html}

  <script>

    function sendConsole(type, args) {
      window.parent.postMessage(
        {
          source: "code-editor",
          type,
          args
        },
        "*"
      );
    }

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function(...args) {
      sendConsole(
        "log",
        args.map(String)
      );

      originalLog(...args);
    };

    console.warn = function(...args) {
      sendConsole(
        "warn",
        args.map(String)
      );

      originalWarn(...args);
    };

    console.error = function(...args) {
      sendConsole(
        "error",
        args.map(String)
      );

      originalError(...args);
    };

    window.onerror = function(
      message,
      source,
      lineno,
      colno,
      error
    ) {
      sendConsole(
        "error",
        [
          String(message)
        ]
      );
    };

    try {

      ${js}

    } catch (error) {

      console.error(error);

    }

  </script>

</body>

</html>`;
  return (
    <iframe
      title="Preview"
      srcDoc={srcDoc}
      className="h-full w-full border-0 bg-white"
      sandbox="allow-scripts"
    />
  );
}
