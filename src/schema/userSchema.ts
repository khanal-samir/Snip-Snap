import { z } from "zod";

const emailSchema = z.string().email("Invalid email address.");
const passSchema = z
  .string()
  .min(6, "Password must be at least six characters.");
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(10, "Username cannot exceed 10 characters")
  .refine((value) => !/\s/.test(value), "Username cannot contain spaces");

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passSchema,
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  token: z.string().length(6, "Invalid OTP token."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    email: emailSchema,
    token: z.string().length(6, "Invalid OTP token."),
    password: passSchema,
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least six characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
