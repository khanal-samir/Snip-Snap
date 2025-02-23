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
  isVerified?: boolean;
};
