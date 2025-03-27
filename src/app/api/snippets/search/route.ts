/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { searchSchema } from "@/schema/snippetSchema";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Authentication
    const result = await getUserId();
    if (result instanceof Response) return result;

    // Parse query parameters
    const queries = req.nextUrl.searchParams;
    const searchParams = {
      id: queries.get("query") || undefined,
      query: queries.get("query") || undefined,
      language: queries.get("language") || undefined,
      limit: Number(queries.get("limit")) || 9,
      page: Number(queries.get("page")) || 1,
    };

    // Validate search parameters
    const payload = searchSchema.safeParse(searchParams);
    if (!payload.success) {
      return ApiResponse.badRequest(
        422,
        "Invalid search parameters",
        payload.error.format()
      );
    }

    const searchConditions: any = {
      isPublic: true,
      OR: [
        payload.data.query ? { id: { contains: payload.data.query } } : {},
        // Case-insensitive partial match for title
        payload.data.query
          ? { title: { contains: payload.data.query, mode: "insensitive" } }
          : {},
        // Case-insensitive partial match for language
        payload.data.language
          ? {
              language: {
                contains: payload.data.language,
                mode: "insensitive",
              },
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0), // Remove empty conditions
    };

    // Pagination calculations
    const limit = payload.data.limit;
    const page = payload.data.page;
    const skip = (page - 1) * limit;

    // Fetch snippets
    const snippets = await prisma.snippet.findMany({
      where: searchConditions,
      skip: skip,
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no snippets found
    if (!snippets.length) {
      return ApiResponse.notFound(
        "No snippets found matching the search criteria!"
      );
    }

    // Count total matching snippets for pagination
    const totalSnippets = await prisma.snippet.count({
      where: searchConditions,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalSnippets / limit);
    const hasNextPage = page < totalPages;

    return ApiResponse.success(
      200,
      {
        snippets,
        metadata: {
          totalSnippets,
          totalPages,
          currentPage: page,
          nextPage: hasNextPage ? page + 1 : null,
        },
      },
      "Snippets searched successfully."
    );
  } catch (error) {
    console.error("Error searching snippets", error);
    return ApiResponse.error("Something went wrong while searching snippets.");
  }
}
