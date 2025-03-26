/* eslint-disable @typescript-eslint/no-explicit-any */
// for form state
export interface IResponse {
  status?: number;
  success?: boolean;
  message: string;
  errors?: any;
  data?: any;
}

// for email verification
export type IToken = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  email: string | null;
};

// next auth
import { ISODateString } from "next-auth";
export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  email?: string | null; // for session type safety
  image?: string | null;
  username?: string;
};

export type star = {
  id?: string;
  userId?: string;
  snippetId?: string;
};

interface ISnippet {
  id: string;
  title: string;
  content?: string;
  language: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  user: CustomUser;
  Star?: star[];
}
export interface CodeEditorProps {
  language?: string;
  theme?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
}
// Define types for the snippet data
import { snippetSchema } from "./schema/snippetSchema";
export type SnippetFormValues = z.infer<typeof snippetSchema>;
interface CodeSnippetEditorProps {
  defaultValues?: SnippetFormValues;
  onSubmit: (data: SnippetFormValues) => void;
  submitButtonText?: string;
  loadingText?: string;
  isLoading?: boolean;
}

//user profile
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  image: string;
  Snippet: Pick<
    ISnippet,
    | "id"
    | "title"
    | "description"
    | "createdAt"
    | "language"
    | "isPublic"
    | "userId"
    | "user"
  >[];
}

//star page pagination
export interface PageData {
  snippets: ISnippet[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
