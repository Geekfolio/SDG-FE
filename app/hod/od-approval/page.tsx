import { ODRequestsTable } from "@/components/hods/content";
import Layout from "@/components/ui/layout";

export default function DashboardPage() {
  return (
    <Layout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">On-Duty Approval Dashboard</h1>
        <ODRequestsTable />
      </main>
    </Layout>
  );
}
