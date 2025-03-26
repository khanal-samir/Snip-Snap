/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { starSchema } from "@/schema/snippetSchema";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    //authentication
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    const { snippetId } = await req.json();

    //validations
    const payload = starSchema.safeParse({ snippetId });
    if (payload.error) {
      const errors = payload.error.format();
      return ApiResponse.badRequest(
        422,
        "Invalid Data for staring snippet.",
        errors
      );
    }
    // toggle star
    const isStarred = await prisma.star.findFirst({
      where: {
        userId,
        snippetId: payload.data.snippetId,
      },
    });
    if (isStarred) {
      await prisma.star.delete({
        where: {
          id: isStarred.id,
        },
      });
      return ApiResponse.success(200, null, "Snippet is not starred anymore.");
    }

    await prisma.star.create({
      data: {
        snippetId: payload.data.snippetId,
        userId,
      },
    });
    return ApiResponse.success(201, null, "Snippet starred successfully.");
  } catch (error) {
    console.error("Error create snippet", error);
    return ApiResponse.error("Someting went wrong while creating snippet.");
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    // Authentication
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;

    // Get total count of starred snippets for pagination metadata
    const totalItems = await prisma.snippet.count({
      where: {
        Star: {
          some: {
            userId,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    // If requested page is beyond total pages and there are items, return bad request
    if (page > totalPages && totalItems > 0) {
      return ApiResponse.badRequest(
        404,
        `Page ${page} does not exist. Total pages: ${totalPages}`
      );
    }

    // Fetch paginated starred snippets
    const starredSnippets = await prisma.snippet.findMany({
      where: {
        Star: {
          some: {
            userId,
          },
        },
      },
      include: {
        Star: true,
        user: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return appropriate response
    if (starredSnippets.length === 0 && totalItems === 0) {
      return ApiResponse.notFound("You haven't starred any snippets yet.");
    }

    return ApiResponse.success(
      200,
      {
        snippets: starredSnippets,
        metadata: {
          currentPage: page,
          totalPages,
          totalItems,
        },
      },
      "Starred snippets retrieved successfully."
    );
  } catch (error) {
    console.error("Error fetching starred snippets", error);
    return ApiResponse.error(
      "Something went wrong while fetching starred snippets."
    );
  }
}
