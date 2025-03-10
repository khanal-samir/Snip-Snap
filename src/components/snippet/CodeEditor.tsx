import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language?: string;
  theme?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor = ({
  language = "javascript",
  theme = "vs-dark",
  value = "",
  onChange,
  readOnly = false,
  height = "500px",
}: CodeEditorProps) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus(); //focus on mount
  };

  return (
    <div className="monaco-editor-container">
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
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
};

export default CodeEditor;
