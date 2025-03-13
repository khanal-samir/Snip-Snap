"use client";

import { useRef, useEffect } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { defineGithubDarkTheme } from "@/lib/utils";
import type { CodeEditorProps } from "@/index";

const CodeEditor = ({
  language = "javascript",
  theme = "github-dark", // Default to GitHub Dark theme
  value = "",
  onChange,
  readOnly = false,
  height = "500px",
}: CodeEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Define GitHub Dark theme when editor mounts
    defineGithubDarkTheme(monaco);
    monaco.editor.setTheme("github-dark");

    editorRef.current = editor;

    // Only focus if not in read-only mode
    if (!readOnly) {
      editor.focus();
    }
  };

  // Update editor options when readOnly changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div className="monaco-editor-container rounded-md overflow-hidden border border-zinc-800">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: "on",
          folding: true,
          renderLineHighlight: "line",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          padding: { top: 8, bottom: 8 },
          fontFamily: "'SF Mono', Menlo, Monaco, 'Courier New', monospace",
          fontLigatures: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
