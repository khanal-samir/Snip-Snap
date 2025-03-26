import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    //authentication
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    //retrieve userId
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
        isVerified: true,
      },
      select: {
        id: true,
      },
    });
    if (!user) return ApiResponse.notFound("User not found! Please try again.");

    // if viewed by owner
    if (user.id === userId) {
      const owner = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          Snippet: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              title: true,
              description: true,
              createdAt: true,
              language: true,
              isPublic: true,
              id: true,
              userId: true,
              user: {
                select: {
                  email: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      if (!owner)
        return ApiResponse.notFound("User not found! Please try again.");
      return ApiResponse.success(
        200,
        owner,
        "User information fetched successfully."
      );
    }

    //by other users
    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },

      include: {
        Snippet: {
          orderBy: {
            createdAt: "desc",
          },
          where: { isPublic: true },
          select: {
            title: true,
            description: true,
            createdAt: true,
            language: true,
            isPublic: true,
            id: true,
            userId: true,
            user: {
              select: {
                email: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!existingUser)
      return ApiResponse.notFound("User not found! Please try again.");

    return ApiResponse.success(
      200,
      existingUser,
      "User information fetched successfully."
    );
  } catch (error) {
    console.error("Error get User", error);
    return ApiResponse.error(
      "Someting went wrong while getting user information."
    );
  }
}
