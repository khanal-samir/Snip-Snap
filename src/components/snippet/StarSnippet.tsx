"use client";
import { Star } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { CustomSession, ISnippet } from "@/index";
import { useSession } from "next-auth/react";

const toggleStar = async (snippetId: string) => {
  try {
    const { data } = await axios.post(`/api/snippets/star`, { snippetId });
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // This maintains the structure your component expects
      throw {
        message: error.response.data.message || "Failed to toggle star.",
        status: error.response.status,
        response: { data: error.response.data },
      };
    }

    throw new Error("Failed to toggle star");
  }
};

function StarSnippet({ snippet }: { snippet: ISnippet }) {
  const { data: session }: { data: CustomSession | null } = useSession();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => toggleStar(snippet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snippets", snippet.id] });
      toast.success("Snippet toggled successfully.");
    },
    onError: () => {
      toast.error("Something went wrong while toggling snippet.");
    },
  });
  console.log(snippet.Star);
  console.log(session?.user?.id);

  const isStarred = snippet.Star?.find((s) => s.userId === session?.user?.id);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => mutation.mutate()}
      className={`gap-2 ${isStarred ? "bg-primary/10 border-primary/20" : ""}`}
    >
      <Star
        className={`h-4 w-4 ${isStarred ? "fill-primary text-primary" : ""}`}
      />
      <span>{snippet.Star?.length}</span>
    </Button>
  );
}

export default StarSnippet;
