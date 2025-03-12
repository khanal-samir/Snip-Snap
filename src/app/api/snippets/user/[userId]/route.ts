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

    //pagination
    const queries = req.nextUrl.searchParams;
    const limit = Number(queries.get("limit")) || 10;
    const page = Number(queries.get("page")) || 1;
    const skip = (page - 1) * limit; // how many data to skip

    //retrieve userId
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
      },
    });
    if (!user) return ApiResponse.notFound("User not found! Please try again.");

    // if viewed by owner
    if (user.id === userId) {
      const snippets = await prisma.snippet.findMany({
        where: {
          userId: user.id,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              username: true,
              email: true,
              image: true,
            },
          },
        },
      });
      if (!snippets.length)
        return ApiResponse.notFound("User snippet not found!");
      return ApiResponse.success(
        200,
        snippets,
        "User snippets fetched successfully."
      );
    }

    //by other users
    const snippets = await prisma.snippet.findMany({
      where: {
        isPublic: true,
        userId: user.id,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!snippets.length)
      return ApiResponse.notFound("User snippet not found!");

    return ApiResponse.success(200, snippets, "Snippets fetched successfully.");
  } catch (error) {
    console.error("Error get snippet", error);
    return ApiResponse.error(
      "Someting went wrong while getting user snippets."
    );
  }
}
