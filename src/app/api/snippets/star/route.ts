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
