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

interface ISnippet {
  id: string;
  title: string;
  content: string;
  language: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: CustomUser;
}
export interface CodeEditorProps {
  language?: string;
  theme?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
}
