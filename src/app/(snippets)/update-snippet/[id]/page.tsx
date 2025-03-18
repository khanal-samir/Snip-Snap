import UpdateSnippet from "@/components/snippet/UpdateSnippet";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <>
      <UpdateSnippet id={id} />
    </>
  );
}
