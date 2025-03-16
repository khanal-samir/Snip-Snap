import SnippetView from "@/components/snippet/snippet-view";

export default async function SnippetPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <SnippetView snippetId={id} />
    </div>
  );
}
