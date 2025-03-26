"use client";

import React from "react";
import ProfileComponent from "@/components/profile/user-profile";

export default function UserPage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  return (
    <div>
      <ProfileComponent userId={userId} />
    </div>
  );
}
