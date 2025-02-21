"use server";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";
import { IResponse } from "..";
import { registerSchema, verifyEmailSchema } from "@/schema/userSchema";
import { ZodError } from "zod";
import { formatError } from "@/lib/utils";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import { sendVerificationEmail } from "@/helpers/sendEmail";

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
    await sendVerificationEmail(payload.email, payload.username, token);

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
