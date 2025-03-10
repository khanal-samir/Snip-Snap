"use client";

import { useState } from "react";
import { Calendar, Code, Eye, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for snippets
const snippets = [
  {
    id: "1",
    title: "React useEffect Hook Example",
    description:
      "A simple example of the useEffect hook in React with cleanup function and dependency array.",
    language: "JavaScript",
    created: "2023-03-15T10:30:00Z",
    stars: 12,
    author: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      username: "johndoe",
    },
  },
  {
    id: "2",
    title: "Tailwind CSS Grid Layout",
    description:
      "A responsive grid layout using Tailwind CSS classes for different screen sizes.",
    language: "HTML",
    created: "2023-03-20T14:45:00Z",
    stars: 8,
    author: {
      name: "Jane Smith",
      avatar: "/placeholder-user.jpg",
      username: "janesmith",
    },
  },
  {
    id: "3",
    title: "Next.js API Route Handler",
    description:
      "Example of a Next.js API route handler with search params and external API fetching.",
    language: "TypeScript",
    created: "2023-04-05T09:15:00Z",
    stars: 15,
    author: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      username: "johndoe",
    },
  },
  {
    id: "4",
    title: "CSS Animation Keyframes",
    description:
      "Smooth animation using CSS keyframes with transform and opacity transitions.",
    language: "CSS",
    created: "2023-04-10T11:20:00Z",
    stars: 6,
    author: {
      name: "Jane Smith",
      avatar: "/placeholder-user.jpg",
      username: "janesmith",
    },
  },
  {
    id: "5",
    title: "React Context API Example",
    description:
      "Creating and using a context provider to share state across components.",
    language: "JavaScript",
    created: "2023-04-15T13:40:00Z",
    stars: 10,
    author: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      username: "johndoe",
    },
  },
  {
    id: "6",
    title: "PostgreSQL Query Optimization",
    description:
      "Tips for optimizing PostgreSQL queries with indexes and query planning.",
    language: "SQL",
    created: "2023-04-20T16:30:00Z",
    stars: 18,
    author: {
      name: "Jane Smith",
      avatar: "/placeholder-user.jpg",
      username: "janesmith",
    },
  },
];

export function SnippetList() {
  const [sortOrder, setSortOrder] = useState("newest");

  // Sort snippets based on the selected order
  const sortedSnippets = [...snippets].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    } else {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    }
  });

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedSnippets.map((snippet) => (
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    src={snippet.author.avatar}
                    alt={snippet.author.name}
                  />
                  <AvatarFallback>
                    {snippet.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  @{snippet.author.username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`#`}>
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Link>
                </Button>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(snippet.created).toLocaleDateString()}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
