"use client";
import { Star } from "lucide-react";
import React, { useState } from "react";
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

  // Local state to manage optimistic UI
  const [optimisticStarred, setOptimisticStarred] = useState(
    snippet.Star?.find((s) => s.userId === session?.user?.id) ? true : false
  );
  const [optimisticStarCount, setOptimisticStarCount] = useState(
    snippet.Star?.length || 0
  );

  const mutation = useMutation({
    mutationFn: () => toggleStar(snippet.id),
    // Optimistic update
    onMutate: () => {
      // Immediately update local state-- state gets batched together then get updated
      setOptimisticStarred((current) => !current);
      setOptimisticStarCount((current) =>
        optimisticStarred ? current - 1 : current + 1
      );
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure final state is correct
      queryClient.invalidateQueries({ queryKey: ["snippets", snippet.id] });
      if (optimisticStarred) toast.success("Snippet starred successfully.");
    },
    onError: () => {
      // Revert optimistic update if mutation fails
      setOptimisticStarred((current) => !current);
      setOptimisticStarCount((current) =>
        optimisticStarred ? current + 1 : current - 1
      );
      toast.error("Something went wrong while toggling snippet.");
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => mutation.mutate()}
      //  disabled={mutation.isPending}
      className={`gap-2 ${optimisticStarred ? "bg-primary/10 border-primary/20" : ""}`}
    >
      <Star
        className={`h-4 w-4 ${optimisticStarred ? "fill-primary text-primary" : ""}`}
      />
      <span>{optimisticStarCount}</span>
    </Button>
  );
}

export default StarSnippet;
