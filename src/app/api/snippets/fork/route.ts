import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Authentication
    const result = await getUserId();
    if (result instanceof Response) return result;
    // Parse request body
    const { originalSnippetId } = await req.json();

    // Validate input
    if (!originalSnippetId) {
      return ApiResponse.badRequest(
        400,
        "Original Snippet ID is required for forking."
      );
    }

    // Find the original snippet
    const originalSnippet = await prisma.snippet.findUnique({
      where: { id: originalSnippetId },
      select: {
        title: true,
        content: true,
        language: true,
        description: true,
        isPublic: true,
      },
    });

    if (!originalSnippet) {
      return ApiResponse.notFound("Original Snippet not found!");
    }

    // Create a new forked snippet
    const forkedSnippet = await prisma.$transaction(async (prisma) => {
      //transcation to perform two prisma opeartion at once
      // Create the new snippet
      const newSnippet = await prisma.snippet.create({
        data: {
          title: `Fork of ${originalSnippet.title}`,
          content: originalSnippet.content,
          language: originalSnippet.language,
          description: originalSnippet.description
            ? `Forked from: ${originalSnippet.description}`
            : `Forked from another snippet`,
          isPublic: originalSnippet.isPublic,
          userId: result,
        },
      });

      // Create the fork relationship
      await prisma.fork.create({
        data: {
          originalId: originalSnippetId,
          forkedId: newSnippet.id,
          userId: result,
        },
      });

      return newSnippet;
    });

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
