import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function POST(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
): Promise<NextResponse> {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;

    const { snippetId } = await params;

    // Fetch the original snippet
    const originalSnippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!originalSnippet) {
      return ApiResponse.notFound("Snippet not found!");
    }

    // Check if snippet is public
    if (!originalSnippet.isPublic) {
      return ApiResponse.forbidden("Cannot fork private snippets.");
    }

    // Prevent forking your own snippet
    if (originalSnippet.userId === result) {
      return ApiResponse.badRequest(400, "You cannot fork your own snippet.");
    }

    // Check if user has already forked this snippet
    const existingFork = await prisma.snippet.findFirst({
      where: {
        userId: result,
        forkedFromId: snippetId,
      },
    });

    if (existingFork) {
      return ApiResponse.badRequest(
        409,
        "You have already forked this snippet.",
        { forkId: existingFork.id }
      );
    }

    // Create the fork in a transaction
    const [forkedSnippet] = await prisma.$transaction([
      // Create the new forked snippet
      prisma.snippet.create({
        data: {
          title: `${originalSnippet.title} (Fork)`,
          content: originalSnippet.content,
          language: originalSnippet.language,
          description: originalSnippet.description,
          isPublic: true,
          userId: result,
          forkedFromId: originalSnippet.id,
        },
        include: {
          user: {
            select: {
              username: true,
              image: true,
              email: true,
            },
          },
          forkedFrom: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      }),
      // Increment the fork count of the original snippet
      prisma.snippet.update({
        where: {
          id: snippetId,
        },
        data: {
          forkCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return ApiResponse.success(
      201,
      forkedSnippet,
      "Snippet forked successfully."
    );
  } catch (error) {
    console.error("Error forking snippet", error);
    return ApiResponse.error("Something went wrong while forking snippet.");
  }
}
