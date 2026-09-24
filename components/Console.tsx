"use client";

type ConsoleMessage = {
  type: "log" | "warn" | "error";
  args: string[];
};

type ConsoleProps = {
  messages: ConsoleMessage[];
  onClear: () => void;
};

export default function Console({
  messages,
  onClear,
}: ConsoleProps) {
  return (
    <div className="h-full bg-zinc-950 text-sm font-mono">

      <div className="h-10 border-b border-zinc-800 flex items-center justify-between px-3">
        <span className="text-zinc-300">
          Console
        </span>

        <button
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="p-3 space-y-1 overflow-auto h-[calc(100%-40px)]">

        {messages.length === 0 && (
          <div className="text-zinc-600">
            Console is empty
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.type === "error"
                ? "text-red-400"
                : message.type === "warn"
                  ? "text-yellow-400"
                  : "text-zinc-300"
            }
          >
            <span className="mr-2">
              {message.type === "error"
                ? "✕"
                : message.type === "warn"
                  ? "⚠"
                  : ">"
              }
            </span>

            {message.args.join(" ")}
          </div>
        ))}

      </div>
    </div>
  );
}