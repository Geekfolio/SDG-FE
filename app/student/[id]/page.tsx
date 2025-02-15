import { StudentDetails } from "@/components/STAFFS/StudentDetails"
import Layout from "@/components/ui/layout"

export default function StudentPage({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <div className="space-y-8">
      <h1 className="text-3xl font-bold">Student Details</h1>
      <StudentDetails id={params.id} />
      </div>
    </Layout>
  )
}

