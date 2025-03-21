import ProfileComponent from "@/components/profile/user-profile";
import React from "react";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;
  return (
    <div>
      <ProfileComponent userId={userId} />
    </div>
  );
}
