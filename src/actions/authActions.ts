"use server";
import prisma from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { IResponse } from "..";
import {
  forgotPasswordSchema,
  registerSchema,
  verifyEmailSchema,
  changePasswordSchema,
  loginSchema,
} from "@/schema/userSchema";
import { ZodError } from "zod";
import { formatError } from "@/lib/utils";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import sendMail from "@/helpers/sendEmail";
import { v4 as uuid } from "uuid";

export async function handleRegister(
  _prevState: unknown,
  formData: FormData
): Promise<IResponse> {
  try {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = registerSchema.parse({ username, email, password });
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: payload.username,
        isVerified: true,
      },
    });

    if (existingUsername) {
      return {
        status: 400,
        message: "Username already exists. Please use another username.",
      };
    }
    //hash pass and OTP
    payload.password = await hash(payload.password, 10);
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (user && user.isVerified) {
      return {
        status: 400,
        message: "Email already exists. Please use another email.",
      };
    } else if (user && !user.isVerified) {
      await prisma.user.update({
        data: {
          username: payload.username,
          password: payload.password,
          verifyToken: token,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
        where: {
          email: payload.email,
        },
      });
    } else {
      const avatar = createAvatar(botttsNeutral, {
        seed: payload.username,
        backgroundColor: ["00acc1", "d81b60", "ffb300"],
      });
      const avtImage = avatar.toDataUri();
      await prisma.user.create({
        data: {
          email: payload.email,
          username: payload.username,
          password: payload.password,
          verifyToken: token,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
          image: avtImage,
        },
      });
    }
    const mailSend = await sendMail(payload.email, "VERIFY", token);
    if (!mailSend) {
      return {
        status: 500,
        message: "Something went wrong while sending OTP. Please try again.",
      };
    }

    return {
      status: 201,
      message: "User registered successfully. Please verify your account.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatError(error);
      return {
        status: 422,
        message: "Your information is invalid. Please try again.",
        errors: errors,
      };
    }
    console.log(error);
    return {
      status: 500,
      message: "Error occured",
    };
  }
}

export async function VerifyEmail(
  _prevState: unknown,
  formData: FormData
): Promise<IResponse> {
  try {
    const email = formData.get("email");
    const token = formData.get("token");

    const payload = verifyEmailSchema.safeParse({ email, token });

    if (!payload.success && payload.error) {
      const errors = formatError(payload.error);
      return {
        message: "Please provide valid information for account verification.",
        errors: errors,
        status: 422,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload.data.email,
        verifyTokenExpiry: {
          gte: new Date(Date.now()),
        },
      },
    });
    if (!user) {
      return {
        message: "OTP token time has expired. Please try to again.",
        status: 404,
      };
    }

    const isTokenValid = user.verifyToken === payload.data.token;
    if (isTokenValid) {
      await prisma.user.update({
        data: {
          isVerified: true,
          verifyToken: null,
          verifyTokenExpiry: null,
        },
        where: {
          email: payload.data.email,
        },
      });
      return {
        message: "Account verified successfully. Please proceed to login.",
        status: 200,
      };
    } else {
      return {
        message: "OTP token is invalid. Please try again.",
        status: 400,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: "Something went wrong while verifying email.",
      status: 500,
    };
  }
}

export async function forgotPassword(
  prevState: unknown,
  formData: FormData
): Promise<IResponse> {
  try {
    const email = formData.get("email");

    const payload = forgotPasswordSchema.safeParse({ email });
    if (payload.error) {
      const errors = formatError(payload.error);
      return {
        message: "Please provide valid email address",
        errors: errors,
        status: 422,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload.data.email,
        isVerified: true,
      },
    });
    if (!user) {
      return {
        message: `User with ${payload.data.email} doesn't exists or email is not verified.`,
        status: 404,
      };
    }

    //pass token
    const passToken = await hash(uuid(), 10);
    await prisma.user.update({
      data: {
        passwordResetToken: passToken,
        passwordResetTokenExpiry: new Date(Date.now() + 3600000),
      },
      where: {
        email: payload.data.email,
      },
    });

    const link = `${process.env.NEXT_PUBLIC_API_URL}/change-password?email=${payload.data.email}&token=${passToken}`;

    const mailSend = await sendMail(user.email, "RESET", link);

    if (!mailSend)
      return {
        status: 500,
        message:
          "Something went wrong while sending password reset email. Please try again.",
      };

    return {
      status: 200,
      message: "Password reset link send. Please check your email.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong while sending password reset email.",
    };
  }
}

export async function changePassword(
  _prevState: unknown,
  formData: FormData
): Promise<IResponse> {
  try {
    const email = formData.get("email");
    const token = formData.get("token");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    const payload = changePasswordSchema.safeParse({
      email,
      token,
      password,
      confirmPassword,
    });
    if (payload.error) {
      const errors = formatError(payload.error);
      return {
        message: "Please provide valid information to reset password.",
        status: 422,
        errors,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload.data.email,
        passwordResetTokenExpiry: {
          gte: new Date(Date.now()),
        },
      },
    });

    // user already checked in forgot password
    if (!user) {
      return {
        message: `Password reset link has expired. Please try again`,
        status: 404,
      };
    }

    const isTokenValid =
      user.passwordResetToken && payload.data.token === user.passwordResetToken;
    if (!isTokenValid) {
      return {
        message: `Password reset token is invalid.`,
        status: 400,
      };
    }

    payload.data.password = await hash(payload.data.password, 10);
    await prisma.user.update({
      data: {
        password: payload.data.password,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
      where: {
        email: payload.data.email,
      },
    });
    return {
      message: `Password reset successfully. Please procced to login`,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Something went wrong while reseting password.",
      status: 500,
    };
  }
}

export async function checkLogin(
  prevState: unknown,
  formData: FormData
): Promise<IResponse> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = loginSchema.safeParse({ email, password });
    if (payload.error) {
      const errors = formatError(payload.error);
      return {
        status: 422,
        message: "Please provide valid credentials.",
        errors: errors,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload.data.email,
        isVerified: true,
      },
    });

    if (!user) {
      return {
        status: 400,
        message: "User not found or Email is not verified.",
      };
    }

    const isPassValid = await compare(payload.data.password, user.password);
    if (!isPassValid) {
      return {
        status: 400,
        message: "Password is incorrect. Please try again",
      };
    }

    return {
      status: 200,
      data: { email: payload.data.email, password: payload.data.password },
      message: "User login successfull. Welcome to Snip Snap.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong while login. Please try again",
    };
  }
}
