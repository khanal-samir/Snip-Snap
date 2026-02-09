"use client";
import { GitFork } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { CustomSession, ISnippet } from "@/index";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const forkSnippet = async (snippetId: string) => {
  try {
    const { data } = await axios.post(`/api/snippets/${snippetId}/fork`);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw {
        message: error.response.data.message || "Failed to fork snippet.",
        status: error.response.status,
        response: { data: error.response.data },
      };
    }
    throw new Error("Failed to fork snippet");
  }
};

interface ForkButtonProps {
  snippet: ISnippet;
  showCount?: boolean;
}

function ForkButton({ snippet, showCount = true }: ForkButtonProps) {
  const { data: session }: { data: CustomSession | null } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get fork count from _count if available, otherwise default to 0
  const forkCount = snippet._count?.forks ?? snippet.forkCount ?? 0;

  // Check if current user is the owner
  const isOwner = snippet.userId === session?.user?.id;

  const mutation = useMutation({
    mutationFn: () => forkSnippet(snippet.id),
    onSuccess: (data) => {
      toast.success("Snippet forked successfully!");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["snippets", snippet.id] });
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
      // Navigate to the forked snippet
      if (data?.id) {
        router.push(`/snippet/${data.id}`);
      }
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Already forked - navigate to existing fork
        toast.info("You have already forked this snippet.");
        const forkId = error.response?.data?.data?.forkId;
        if (forkId) {
          router.push(`/snippet/${forkId}`);
        }
      } else {
        toast.error(
          error.message || "Something went wrong while forking snippet."
        );
      }
    },
  });

  // Don't show fork button if user is not logged in or is the owner
  if (!session?.user || isOwner) {
    if (showCount && forkCount > 0) {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="gap-2 opacity-60"
        >
          <GitFork className="h-4 w-4" />
          <span>{forkCount}</span>
        </Button>
      );
    }
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="gap-2"
    >
      <GitFork className="h-4 w-4" />
      {showCount && <span>{forkCount}</span>}
      <span className="hidden sm:inline">Fork</span>
    </Button>
  );
}

export default ForkButton;
