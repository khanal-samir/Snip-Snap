import VerificationEmail from "../../emails/VerificationEmail";
import type { IResponse } from "..";
import { Resend } from "resend";
import PasswordResetLink from "../../emails/PasswordReset";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<IResponse> => {
  try {
    await resend.emails.send({
      from: "Snip Snap <onboarding@resend.dev>",
      to: email,
      subject: "Snip Snap | Email Verification",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
      errors: error,
    };
  }
};

export const sendPasswordResetLink = async (
  username: string,
  email: string,
  link: string
): Promise<IResponse> => {
  try {
    await resend.emails.send({
      from: "Snip Snap <onboarding@resend.dev>",
      to: email,
      subject: "Snip Snap | Password Reset Link",
      react: PasswordResetLink({ username, link }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
      errors: error,
    };
  }
};
