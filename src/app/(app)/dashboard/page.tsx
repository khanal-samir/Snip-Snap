import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SnippetList } from "@/components/dashboard/snippet-list";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <SnippetList />
    </DashboardLayout>
  );
}
