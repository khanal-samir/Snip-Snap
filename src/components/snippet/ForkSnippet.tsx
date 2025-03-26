"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";
import { Button } from "../ui/button";
import { GitFork } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ISnippet } from "@/index";
const createFork = async (originalSnippetId: string) => {
  try {
    console.log(originalSnippetId);

    const { data } = await axios.post(`/api/snippets/fork`, {
      originalSnippetId,
    });
    return data.data as ISnippet;
  } catch (error) {
    console.log(error);

    if (axios.isAxiosError(error) && error.response) {
      throw {
        message: error.response.data.message || "Failed to fork snippet.",
        status: error.response.status,
        response: { data: error.response.data },
      };
    }
    throw new Error("Failed to fork snippet.");
  }
};
function ForkSnippet({ snippetId }: { snippetId: string }) {
  const router = useRouter();
  const forkMutation = useMutation({
    mutationFn: () => createFork(snippetId),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Snippet forked successfully.");
      router.push(`/snippet/${data.id}`);
    },
    onError: () => {
      toast.error(
        "Something went wrong while forking snippet. Please try again."
      );
    },
  });
  const handleSubmit = () => forkMutation.mutate();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <GitFork className="h-any4 w-4" />
          <span>{3}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a fork from the given snippet and saved to your
            profile as a forked Snippet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ForkSnippet;
