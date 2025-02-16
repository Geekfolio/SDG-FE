import { StudentDetails } from "@/components/STAFFS/StudentDetails";
import Layout from "@/components/ui/layout";

export default async function StudentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Student Details</h1>
        <StudentDetails id={params.id} />
      </div>
    </Layout>
  );
}
