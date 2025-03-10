import { NextRequest, NextResponse } from "next/server";
import { snippetSchema } from "@/schema/snippetSchema";
import { ApiResponse } from "@/lib/apiResponse";

import prisma from "@/lib/db";
import getUserId from "@/helpers/getUserId";

export async function POST(req: NextRequest): Promise<NextResponse> {
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
    //creation
    const snippet = await prisma.snippet.create({
      data: {
        title: payload.data.title,
        language: payload.data.language,
        content: payload.data.content,
        description: payload.data.description,
        isPublic: payload.data.isPublic,
        userId: result,
      },
    });

    return ApiResponse.success(201, snippet, "Snippet created successfully");
  } catch (error) {
    console.error(error);
    return ApiResponse.error("Someting went wrong while creating snippet");
  }
}
