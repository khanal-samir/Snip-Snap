"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarHolder() {
  const { data: session } = useSession();
  console.log("session", session);

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={session?.user?.image || ""} alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}
