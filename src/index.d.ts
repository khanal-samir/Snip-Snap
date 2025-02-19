/* eslint-disable @typescript-eslint/no-explicit-any */
// for form state
export interface IState {
  status: number;
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
