"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Calendar, Code, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import type { CustomSession, ISnippet } from "@/index";
import { useQueryClient } from "@tanstack/react-query";
import { getSnippet } from "@/lib/utils";
import { useSession } from "next-auth/react";
import SnippetActions from "../snippet/snippet-actions";

export default function Snippets({ snippets }: { snippets: ISnippet[] }) {
  const queryClient = useQueryClient();
  // prefetch data on hover
  const onHoverPostOneLink = (id: string) =>
    queryClient.prefetchQuery({
      //prefetches the data
      queryKey: ["snippets", id],
      queryFn: () => getSnippet(id),
    });
  const { data: session }: { data: CustomSession | null } = useSession();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <Card key={snippet.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 text-base">
                {snippet.title}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Code className="mr-1 h-3 w-3" />
                {snippet.language}
              </div>
            </div>
            {session?.user?.id === snippet.userId && (
              <SnippetActions snippetId={snippet.id} />
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {snippet.description}
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-4 py-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={snippet.user.image!}
                  alt={snippet.user.username}
                />
                <AvatarFallback>
                  {snippet.user?.username!.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                @{snippet.user.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                onMouseEnter={() => onHoverPostOneLink(snippet.id)}
              >
                <Link href={`snippet/${snippet.id}`}>
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
