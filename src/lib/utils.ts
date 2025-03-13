/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//zod error
import { ZodError } from "zod";
export const formatError = (err: ZodError) => {
  const totalErrors: any = {};
  err.errors.forEach((issue) => {
    totalErrors[issue.path?.[0]] = issue.message;
  });

  return totalErrors;
};
//languages for code editor
export const languages = [
  "javascript",
  "typescript",
  "html",
  "css",
  "python",
  "java",
  "csharp",
  "cpp",
  "php",
  "ruby",
  "go",
  "rust",
];
// GitHub Dark theme definition
export const defineGithubDarkTheme = (monaco: any) => {
  monaco.editor.defineTheme("github-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d", fontStyle: "italic" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "regexp", foreground: "a5d6ff" },
      { token: "type", foreground: "d2a8ff" },
      { token: "class", foreground: "d2a8ff" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "c9d1d9" },
      { token: "variable.predefined", foreground: "79c0ff" },
      { token: "tag", foreground: "7ee787" },
      { token: "delimiter", foreground: "c9d1d9" },
      { token: "delimiter.html", foreground: "c9d1d9" },
    ],
    colors: {
      "editor.foreground": "#c9d1d9",
      "editor.background": "#0d1117",
      "editor.selectionBackground": "#3b5070",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#c9d1d9",
      "editorWhitespace.foreground": "#484f58",
      "editorIndentGuide.background": "#21262d",
      "editor.selectionHighlightBorder": "#3b5070",
    },
  });
};
