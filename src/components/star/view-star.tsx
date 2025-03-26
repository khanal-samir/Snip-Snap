"use client";
import { useEffect, useState } from "react";
import Snippets from "../common/Snippets";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SnippetsLoading from "../common/SnippetSkeleton";
import { toast } from "sonner";
import type { PageData } from "@/index";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageNumbers } from "@/lib/utils";

const fetchStarredSnippets = async (page: number, limit: number) => {
  try {
    const { data } = await axios.get("/api/snippets/star", {
      params: {
        page,
        limit,
      },
    });
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw {
        message:
          error.response.data.message || "Failed to fetch starred snippets",
        status: error.response.status,
        response: { data: error.response.data },
      };
    }
    throw new Error("Failed to fetch starred snippets");
  }
};

export function StarredSnippetList() {
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, isError, error, refetch } = useQuery<
    PageData,
    Error
  >({
    queryKey: ["starred-snippets", page],
    queryFn: () => fetchStarredSnippets(page, limit),
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch starred snippets");
    }
  }, [error]);

  const snippets = data?.snippets || [];
  const totalPages = data?.metadata?.totalPages || 1;
  const currentPage = data?.metadata?.currentPage || page;

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Starred Snippets
        </h1>
      </header>

      {isLoading ? (
        <SnippetsLoading />
      ) : isError ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium text-destructive mb-2">
            Unable to load starred snippets
          </h3>
          <p className="text-muted-foreground mb-6">
            There was a problem fetching your starred snippets
          </p>
          <Button variant="outline" className="px-6" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : snippets.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">
            No starred snippets found
          </h3>
          <p className="text-muted-foreground">
            You haven&apos;t starred any snippets yet!
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <Snippets snippets={snippets} />
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-8 pb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((pageNum, index) =>
              typeof pageNum === "number" ? (
                <Button
                  key={index}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  className={`w-10 h-10 ${pageNum === currentPage ? "pointer-events-none" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ) : (
                <span key={index} className="px-1">
                  {pageNum}
                </span>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
