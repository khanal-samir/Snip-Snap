import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    // Authentication
    const result = await getUserId();
    if (result instanceof Response) return result;

    // Get total count of starred snippets for pagination metadata
    const totalItems = await prisma.snippet.count({
      where: {
        Star: {
          some: {
            userId: params.userId,
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
            userId: params.userId,
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
