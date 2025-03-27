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
// get snippet from id
import axios from "axios";
export const getSnippet = async (id: string) => {
  try {
    const { data } = await axios.get(`/api/snippets/${id}`);
    return data.data;
  } catch (error) {
    // With axios, the error object contains response details
    if (axios.isAxiosError(error) && error.response) {
      // This maintains the structure your component expects
      throw {
        message: error.response.data.message || "Failed to fetch snippet",
        status: error.response.status,
        response: { data: error.response.data },
      };
    }
    // For network errors or other issues
    throw new Error("Failed to fetch snippet");
  }
};

import { toast } from "sonner";
export const copySnippetId = (id: string) => {
  navigator.clipboard.writeText(id);
  toast.success("Snippet ID copied to clipboard");
};

// Generate page numbers to display
export const getPageNumbers = (totalPages: number, currentPage: number) => {
  const MAX_VISIBLE_PAGES = 5;
  const pageNumbers = [];

  // If total pages are less than or equal to max visible, show all pages
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always add first page
  pageNumbers.push(1);

  // Determine start and end of middle section
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // Adjust for pages near the beginning or end
  if (currentPage <= 3) {
    endPage = Math.min(totalPages - 1, 4);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(2, totalPages - 3);
  }

  // Add ellipsis before middle section if needed
  if (startPage > 2) {
    pageNumbers.push("...");
  }

  // Add middle section
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Add ellipsis after middle section if needed
  if (endPage < totalPages - 1) {
    pageNumbers.push("...");
  }

  // Always add last page
  pageNumbers.push(totalPages);

  return pageNumbers;
};

export const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "SQL",
  "Shell",
];
