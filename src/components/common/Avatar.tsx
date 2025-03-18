"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomSession } from "@/index";

export default function AvatarHolder() {
  const { data: session }: { data: CustomSession | null } = useSession();
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={session?.user?.image || ""}
        alt={session?.user?.username}
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}
