"use client";
import { StarredSnippetList } from "@/components/star/view-star";
import { CustomSession } from "@/index";
import { useSession } from "next-auth/react";
import React from "react";

export default function StarPage() {
  const { data: session }: { data: CustomSession | null } = useSession();
  return (
    <>
      <StarredSnippetList userId={session?.user?.id as string} />
    </>
  );
}
