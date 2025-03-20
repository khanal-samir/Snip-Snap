"use client";
import { MoreVertical, Pencil, Trash2, Copy, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { copySnippetId } from "@/lib/utils";

interface SnippetActionsProps {
  snippetId: string;
}

export default function SnippetActions({ snippetId }: SnippetActionsProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/snippets/${id}`);
      return data.message;
    },
    onSuccess: (msg: string) => {
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["snippets"] });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Actions</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Snippet Actions</DropdownMenuLabel>
          <Link href={`/update-snippet/${snippetId}`}>
            {" "}
            <DropdownMenuItem className="cursor-pointer">
              {" "}
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>{" "}
          </Link>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => copySnippetId(snippetId)}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy to clipboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => deleteMutation.mutate(snippetId)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
