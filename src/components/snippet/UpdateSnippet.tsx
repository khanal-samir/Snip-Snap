"use client";
import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSnippet } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLink from "../common/DashboardLink";
import CodeSnippetEditor from "./CodeSnippetEditor";
import { ISnippet, SnippetFormValues } from "@/index";
import axios from "axios";
export default function UpdateSnippet({ id }: { id: string }) {
  const router = useRouter();
  const {
    data: snippet,
    error,
    isLoading,
  } = useQuery<ISnippet, Error>({
    queryKey: ["snippets", id],
    queryFn: () => getSnippet(id),
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      router.push("/dashboard");
    }
  }, [error, router]);

  //update data and redirect
  const mutation = useMutation({
    mutationFn: async (newSnippet: SnippetFormValues) => {
      const { data } = await axios.put(`/api/snippets/${id}`, newSnippet);
      return data;
    },
    onSuccess: () => {
      toast.success("Snippet updated successfully");
      router.push(`/snippet/${id}`);
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
          <DashboardLink />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-medium mb-2">Loading snippet...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the snippet data.
          </p>
        </div>
      </div>
    );
  }
  const handleSubmit = (data: SnippetFormValues) => mutation.mutate(data);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <DashboardLink />
        <div className="text-sm text-muted-foreground">Update code snippet</div>
      </div>

      <CodeSnippetEditor
        onSubmit={handleSubmit}
        defaultValues={{
          title: snippet?.title || "",
          description: snippet?.description || "",
          content: snippet?.content || "",
          isPublic: snippet?.isPublic ?? true,
          language: snippet?.language || "javascript",
        }}
        isLoading={mutation.isPending}
        submitButtonText="Update snippet"
        loadingText="Updating..."
      />
    </div>
  );
}
