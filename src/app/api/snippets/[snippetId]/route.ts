import { NextRequest, NextResponse } from "next/server";
import { snippetSchema } from "@/schema/snippetSchema";
import { ApiResponse } from "@/lib/apiResponse";
import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function PUT(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
): Promise<NextResponse> {
  try {
    //authentication
    const result = await getUserId();
    if (result instanceof Response) return result;

    const { title, language, content, isPublic, description } =
      await req.json();
    //validations
    const payload = snippetSchema.safeParse({
      title,
      language,
      content,
      isPublic,
      description,
    });
    if (payload.error) {
      const errors = payload.error.format();
      return ApiResponse.badRequest(
        422,
        "Invalid Data for creating snippet.",
        errors
      );
    }

    const snippet = await prisma.snippet.findUnique({
      where: {
        userId: result,
        id: params.snippetId,
      },
    });
    if (!snippet)
      return ApiResponse.notFound(
        "User snippet not found! Failed to update the document."
      );
    //update single document
    await prisma.snippet.update({
      data: {
        title: payload.data.title,
        language: payload.data.language,
        content: payload.data.content,
        description: payload.data.description,
        isPublic: payload.data.isPublic,
      },
      where: {
        userId: result,
        id: params.snippetId,
      },
    });
    return ApiResponse.success(201, null, "Snippet updated successfully.");
  } catch (error) {
    console.error("Error update snippet", error);
    return ApiResponse.error("Someting went wrong while updating snippet.");
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
): Promise<NextResponse> {
  try {
    //authentication
    const result = await getUserId();
    if (result instanceof Response) return result;

    //deletion
    await prisma.snippet.delete({
      where: {
        userId: result,
        id: params.snippetId,
      },
    });
    return ApiResponse.success(200, null, "User snippet fetched successfully.");
  } catch (error) {
    console.error("Error delete snippet", error);
    return ApiResponse.error(
      "Someting went wrong while deleting user snippet."
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
): Promise<NextResponse> {
  try {
    //authentication
    const { snippetId } = await params;
    const result = await getUserId();
    if (result instanceof Response) return result;

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
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
    if (!snippet) return ApiResponse.notFound("User snippet not found!");

    return ApiResponse.success(
      200,
      snippet,
      "User snippet fetched successfully."
    );
  } catch (error) {
    console.error("Error get snippet", error);
    return ApiResponse.error("Someting went wrong while getting user snippet.");
  }
}
