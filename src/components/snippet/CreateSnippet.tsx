"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import CodeSnippetEditor from "@/components/snippet/CodeSnippetEditor";
import DashboardLink from "../common/DashboardLink";
import { ISnippet, SnippetFormValues } from "@/index";
import { useRouter } from "next/navigation";

export default function CreateSnippet() {
  // create snippet api call
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (newSnippet: SnippetFormValues) => {
      const { data } = await axios.post("/api/snippets", newSnippet);
      return data.data;
    },
    onSuccess: (data: ISnippet) => {
      toast.success("Snippet created successfully");
      router.push(`/snippet/${data.id}`);
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });

  const handleSubmit = (data: SnippetFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <DashboardLink />
        <div className="text-sm text-muted-foreground">
          Create a new code snippet
        </div>
      </div>

      <CodeSnippetEditor
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
        submitButtonText="Create snippet"
        loadingText="Creating..."
      />
    </div>
  );
}
