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
export const languages = [
  "typescript",
  "javascript",
  "html",
  "css",
  "python",
  "java",
  "csharp",
  "cpp",
  "php",
  "ruby",
];
