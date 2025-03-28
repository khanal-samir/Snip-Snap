"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, User, Code2, Star } from "lucide-react";
import Snippets from "@/components/common/Snippets";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import type { UserProfile, CustomSession } from "@/index";
import axios from "axios";
import { StarredSnippetList } from "../star/view-star";

export async function fetchUserProfile(userId: string) {
  try {
    const { data } = await axios(`/api/user/${userId}`);
    return data.data as UserProfile;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw {
        message: error.response.data.message || "Failed to user information",
        status: error.response.status,
        response: { data: error.response.data },
      };
    }
    throw new Error("Failed to fetch user information");
  }
}

export default function ProfileComponent({ userId }: { userId: string }) {
  const { data: session }: { data: CustomSession | null } = useSession();
  const isOwner = session?.user?.id === userId;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserProfile(userId),
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Failed to load profile information.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profile.image} alt={profile.username} />
              <AvatarFallback className="text-2xl">
                {profile.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <User className="mr-1 h-4 w-4" />
                    <span>{profile.id}</span>
                  </div>
                </div>

                {isOwner && (
                  <Badge variant="outline" className="px-3 py-1">
                    Your Profile
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Code2 className="mr-2 h-4 w-4" />
                  <span>{profile.Snippet.length} Snippets</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Joined {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="snippets" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="snippets">
            <Code2 className="mr-2 h-4 w-4" />
            Snippets
          </TabsTrigger>
          <TabsTrigger value="starred">
            <Star className="mr-2 h-4 w-4" />
            Starred
          </TabsTrigger>
        </TabsList>

        <TabsContent value="snippets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              My Snippets
            </h1>
            <div className="text-sm text-muted-foreground">
              {profile.Snippet.length}{" "}
              {profile.Snippet.length === 1 ? "snippet" : "snippets"}
            </div>
          </div>
          <Separator />

          {profile.Snippet.length > 0 ? (
            <Snippets snippets={profile.Snippet} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No snippets found</h3>
              <p className="text-muted-foreground mt-1">
                {isOwner
                  ? "You haven't created any snippets yet."
                  : "This user hasn't created any public snippets yet."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="starred">
          <StarredSnippetList userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
}
