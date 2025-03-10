import { z } from "zod";

const titleSchema = z
  .string()
  .min(3, "Title must be at least 3 characters")
  .max(10, "Title cannot exceed 10 characters");
const languageSchema = z.string();
const contentSchema = z
  .string()
  .min(10, "Please at least have 10 characters for your snippet");
const descriptionSchema = z.string().optional();
const isPublicSchema = z.boolean();

export const snippetSchema = z.object({
  title: titleSchema,
  language: languageSchema,
  content: contentSchema,
  description: descriptionSchema,
  isPublic: isPublicSchema,
});
