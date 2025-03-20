"use client";
import { useEffect, useRef } from "react";
import Snippets from "../common/Snippets";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import SnippetsLoading from "../common/SnippetSkeleton";
import { toast } from "sonner";
import type { ISnippet } from "@/index";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface PageData {
  snippets: ISnippet[];
  nextPage: number | null;
}

export function SnippetList() {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PageData, Error>({
    queryKey: ["snippets", "infinite"],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const { data } = await axios.get("/api/snippets", {
          params: {
            page: pageParam,
            limit: 8,
          },
        });
        return {
          snippets: data.data.snippets,
          nextPage: data.data.metadata?.nextPage || null,
        };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw {
            message: error.response.data.message || "Failed to fetch snippets",
            status: error.response.status,
            response: { data: error.response.data },
          };
        }
        throw new Error("Failed to fetch snippets");
      }
    },
  });

  // Implement intersection observer for automatic loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch snippets");
    }
  }, [error]);

  const snippets = data?.pages.flatMap((page) => page.snippets) || [];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Code Snippets
        </h1>
      </header>

      {isLoading ? (
        <SnippetsLoading />
      ) : isError ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium text-destructive mb-2">
            Unable to load snippets
          </h3>
          <p className="text-muted-foreground mb-6">
            There was a problem fetching the snippets
          </p>
          <Button
            variant="outline"
            className="px-6"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : snippets.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No snippets found</h3>
          <p className="text-muted-foreground">
            Start creating your first snippet!
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <Snippets snippets={snippets} />

            {/* Fade effect at the bottom when more content is available */}
            {hasNextPage && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            )}
          </div>

          <div ref={observerTarget} className="h-4" />

          {hasNextPage && (
            <div className="flex justify-center mt-8 pb-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="min-w-[160px] rounded-full px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading snippets...
                  </>
                ) : (
                  "Load More Snippets"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
