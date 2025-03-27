"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import type { ISnippet } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Snippets from "@/components/common/Snippets";
import SnippetsLoading from "@/components/common/SnippetSkeleton";
import { getPageNumbers } from "@/lib/utils";
import { LANGUAGES } from "@/lib/utils";

interface SearchPageData {
  snippets: ISnippet[];
  metadata: {
    totalSnippets: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [language, setLanguage] = useState<string>(
    searchParams.get("language") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Update URL when search parameters change
  const updateUrl = (query: string, lang: string, page: number) => {
    //setting query params
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (lang) params.set("language", lang);
    if (page > 1) params.set("page", page.toString());

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(searchQuery, language, 1);
    setCurrentPage(1);
  };

  // Update URL when page changes while typing
  useEffect(() => {
    if (searchQuery || language) {
      updateUrl(searchQuery, language, currentPage);
    }
  }, [currentPage]);

  // Reset page when language changes
  useEffect(() => {
    setCurrentPage(1);
  }, [language]);

  const { data, isLoading, isError, error, refetch } = useQuery<SearchPageData>(
    {
      queryKey: ["snippets", "search", searchQuery, language, currentPage],
      queryFn: async () => {
        try {
          //initalize params
          const params: Record<string, string | number> = {
            page: currentPage,
            limit: 6,
          };

          if (searchQuery) {
            params.query = searchQuery;
          }

          if (language && language !== "all") {
            params.language = language;
          }

          const { data } = await axios.get("/api/snippets/search", { params });

          return data.data;
        } catch (error) {
          console.log(error);

          if (axios.isAxiosError(error) && error.response) {
            throw {
              message:
                error.response.data.message || "Failed to search snippets",
              status: error.response.status,
              response: { data: error.response.data },
            };
          }
          throw new Error("Failed to search snippets");
        }
      },
      enabled: searchQuery.length > 0 || language.length > 0,
    }
  );

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to search snippets"
      );
    }
  }, [error]);

  const snippets = data?.snippets || [];
  const totalPages = data?.metadata.totalPages || 0;
  const totalSnippets = data?.metadata.totalSnippets || 0;

  const handleClearSearch = () => {
    setSearchQuery("");
    setLanguage("");
    setCurrentPage(1);
    router.push("/search");
  };

  // Generate page numbers for pagination
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Search Snippets
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang.toLocaleLowerCase()}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" className="sm:w-auto">
            Search
          </Button>

          {(searchQuery || language) && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearSearch}
              className="sm:w-auto"
            >
              Clear Filters
            </Button>
          )}
        </form>
      </header>

      {/* Search status */}
      {(searchQuery || language) && !isLoading && !isError && (
        <div className="text-sm text-muted-foreground">
          {totalSnippets > 0 ? (
            <p>
              Found {totalSnippets} snippet{totalSnippets !== 1 ? "s" : ""}
            </p>
          ) : (
            <p>No snippets found matching your search criteria</p>
          )}
        </div>
      )}

      {/* Empty state when no search criteria */}
      {!searchQuery && !language && (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Search for code snippets</h3>
          <p className="text-muted-foreground">
            Enter a search term or select a language to find snippets
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <SnippetsLoading />}

      {/* Error state */}
      {isError && (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-medium text-destructive mb-2">
            Unable to load snippets
          </h3>
          <p className="text-muted-foreground mb-6">
            There was a problem with your search
          </p>
          <Button variant="outline" className="px-6" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Results */}
      {!isLoading &&
        !isError &&
        (searchQuery || language) &&
        snippets.length > 0 && (
          <>
            <Snippets snippets={snippets} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageNumbers?.map((page, index) =>
                  typeof page === "number" ? (
                    <Button
                      key={index}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 ${currentPage === page ? "bg-primary/10 border-primary/20" : ""}`}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={index} className="px-1">
                      {page}
                    </span>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

      {/* No results state */}
      {!isLoading &&
        !isError &&
        (searchQuery || language) &&
        snippets.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">
              No matching snippets found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              className="px-6"
              onClick={handleClearSearch}
            >
              Clear Search
            </Button>
          </div>
        )}
    </div>
  );
}
