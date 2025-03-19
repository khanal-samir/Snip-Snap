"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  FileCode,
  Clock,
  MessageSquare,
  Share2,
  Copy,
  GitFork,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CodeEditor from "@/helpers/CodeEditor";
import SnippetActions from "@/components/snippet/snippet-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import DashboardLink from "../common/DashboardLink";
import { useQuery } from "@tanstack/react-query";
import { getSnippet } from "@/lib/utils";
import type { CustomSession, ISnippet } from "@/index";
import { useSession } from "next-auth/react";
import AiExplanationDialog from "../common/ai-explaination";

export default function SnippetView({ snippetId }: { snippetId: string }) {
  const { data: session }: { data: CustomSession | null } = useSession();
  const {
    data: snippet,
    isLoading,
    error,
  } = useQuery<ISnippet, Error>({
    queryKey: ["snippets", snippetId],
    queryFn: () => getSnippet(snippetId),
  });
  const isOwner = session?.user?.id === snippet?.userId;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <DashboardLink />
        </div>

        <Card className="border shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-8 w-64 bg-muted rounded-md"></div>
              <div className="h-4 w-48 bg-muted/60 rounded-md"></div>
              <div className="text-muted-foreground mt-2">
                Loading snippet...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!snippet) {
    notFound(); // This will trigger Next.js to show the not-found page
  }

  const copySnippetId = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.id);
      toast.success("Snippet ID copied to clipboard");
    } else {
      toast.error("Snippet data is not available");
    }
  };

  if (error) toast.error(error.message);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <DashboardLink />

        <div className="flex items-center gap-3">
          <Badge
            variant={snippet.isPublic ? "default" : "secondary"}
            className="text-xs"
          >
            {snippet.isPublic ? "Public" : "Private"}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium">
            {snippet.language}
          </Badge>
        </div>
      </div>

      <Card className="border shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 border-b px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileCode className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-medium">{snippet.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* //check if user has starred the snippet */}
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${snippet.id ? "bg-primary/10 border-primary/20" : ""}`}
              >
                <Star
                  className={`h-4 w-4 ${snippet.id ? "fill-primary text-primary" : ""}`}
                />
                <span>{5}</span>
              </Button>

              <Button variant="outline" size="sm" className="gap-2">
                <GitFork className="h-any4 w-4" />
                <span>{3}</span>
              </Button>

              {isOwner && <SnippetActions snippetId={snippet.id} />}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
              {snippet.user?.image ? (
                <Image
                  src={snippet.user.image || "/placeholder.svg"}
                  alt={snippet.user.username || "avatar image"}
                  width={24}
                  height={24}
                  className="rounded-full h-6 w-6 border"
                />
              ) : (
                <div className="rounded-full bg-primary/20 h-6 w-6 flex items-center justify-center text-xs text-primary font-medium border border-primary/10">
                  {snippet.user?.username?.charAt(0) || "?"}
                </div>
              )}
              <span className="font-medium">
                {snippet.user?.username || "Unknown User"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Created {new Date(snippet.createdAt).toLocaleString()}
              </span>
            </div>

            {snippet.updatedAt && snippet.updatedAt !== snippet.createdAt && (
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Updated {new Date(snippet.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-b">
            <div className="overflow-hidden bg-[#0D1117] border-t border-zinc-800">
              <div className="flex items-center justify-between bg-[#161B22] px-4 py-2 border-b border-zinc-800">
                <div className="text-xs text-zinc-400 font-mono">
                  {snippet.language}
                </div>
                <div className="text-xs text-zinc-400">
                  {snippet.content.split("\n").length} lines
                </div>
              </div>
              <div className="rounded-none">
                <CodeEditor
                  language={snippet.language}
                  value={snippet.content}
                  readOnly={true}
                  height="400px"
                />
              </div>
            </div>
          </div>

          {snippet.description && (
            <div className="p-6">
              <div className="rounded-lg overflow-hidden border shadow-sm">
                <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">Description</span>
                </div>
                <div className="p-5 text-sm leading-relaxed bg-card">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {snippet.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t py-4 px-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md border border-border/50 w-fit cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={copySnippetId}
                  >
                    <span className="text-xs text-muted-foreground">ID:</span>
                    <code className="text-xs font-mono">{snippet.id}</code>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Click to copy snippet ID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <AiExplanationDialog snippetContent={snippet.content} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
