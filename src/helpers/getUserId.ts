import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ApiResponse } from "@/lib/apiResponse";
import { CustomUser } from "..";
import { NextResponse } from "next/server";

export default async function getUserId(): Promise<string | NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      return ApiResponse.unauthorized(
        "Please login to proceed for further actions."
      );
    const user = session.user as CustomUser;
    return user.id as string;
  } catch (error) {
    console.error("Error while getting session", error);
    return ApiResponse.error(
      "Something went wrong while getting user session."
    );
  }
}
