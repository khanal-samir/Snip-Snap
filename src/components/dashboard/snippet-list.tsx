"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Snippets from "../common/Snippets";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SnippetsLoading from "../common/SnippetSkeleton";
import { toast } from "sonner";

export function SnippetList() {
  const [sortOrder, setSortOrder] = useState("newest");
  const {
    data: snippets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["snippets"],
    queryFn: async () => {
      const { data } = await axios.get("/api/snippets");
      return data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // // Sort snippets based on the selected order
  // const sortedSnippets = [...snippets].sort((a, b) => {
  //   if (sortOrder === "newest") {
  //     return new Date(b.created).getTime() - new Date(a.created).getTime();
  //   } else {
  //     return new Date(a.created).getTime() - new Date(b.created).getTime();
  //   }
  // })

  if (error) toast.error(error.message);
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="hidden sm:block text-2xl font-bold">Browse Snippets</h1>
        <div className="flex items-center gap-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Snippet
          </Button>
        </div>
      </header>

      {isLoading || isError ? (
        <SnippetsLoading />
      ) : (
        <Snippets snippets={snippets} />
      )}
    </div>
  );
}
