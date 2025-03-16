"use client";
import Image from "next/image";
import {
  FileCode,
  // Star,
  // GitFork,
  Clock,
  MessageSquare,
  Download,
  Share2,
  Sparkles,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { CustomSession, ISnippet } from "@/index";
import { useSession } from "next-auth/react";

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
  const isOwner = session?.user?.id === snippet?.user.id;
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

  const copySnippetId = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.id);
      toast.success("Snippet ID copied to clipboard");
    } else {
      toast.error("Snippet data is not available");
    }
  };

  if (error) toast.error(error.message);
  console.log(error);

  return (
    <div className="space-y-6">
      {snippet ? (
        <>
          {" "}
          <div className="flex items-center justify-between bg-background border rounded-lg p-4 shadow-sm">
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
            <div className="bg-gradient-to-r from-muted/50 to-background border-b px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <FileCode className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">{snippet.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 ${ 52 ? "bg-primary/10 border-primary/20" : ""}`}
                  >
                    <Star
                      className={`h-4 w-4 ${snippet.starred ? "fill-primary text-primary" : ""}`}
                    />
                    <span>{snippet.stars}</span>
                  </Button> */}

                  {/* <Button variant="outline" size="sm" className="gap-2">
                    <GitFork className="h-4 w-4" />
                    <span>{snippet.forks}</span>
                  </Button> */}

                  {isOwner && <SnippetActions snippetId={snippet.id} />}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                <div className="flex items-center gap-2 bg-muted/30 px-2 py-1 rounded-full">
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

                <span className="text-muted-foreground/60">•</span>

                <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Created {new Date(snippet.createdAt).toLocaleString()}
                  </span>
                </div>

                {snippet.updatedAt &&
                  snippet.updatedAt !== snippet.createdAt && (
                    <>
                      <span className="text-muted-foreground/60">•</span>
                      <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          Updated {new Date(snippet.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
              </div>
            </div>

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
                <div className="p-6 bg-gradient-to-b from-muted/5 to-transparent">
                  <div className="rounded-lg overflow-hidden border shadow-sm">
                    <div className="bg-gradient-to-r from-primary/5 to-muted/30 px-4 py-3 border-b flex items-center gap-2">
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
            </CardContent>
          </Card>
          <div className="flex items-center justify-between text-sm border-t border-b py-4 px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md border border-border/50 w-fit cursor-pointer hover:bg-muted/50 transition-colors"
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
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="default"
                size="sm"
                className="text-xs gap-1.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">No Snippet Found!</h2>
            <p className="mb-6">
              The snippet you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <div className="flex justify-center gap-4">
              <DashboardLink />
              <Button>Back to Home</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
