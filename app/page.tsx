import { redirect } from "next/navigation"

export default function Home() {
  const role = "staff"
  
  const redirectPaths = {
    administrator: "/dashboard",
    hod: "/hod-dashboard",
    staff: "/staff-dashboard",
    student: "/student-dashboard"
  }

  return redirect(redirectPaths[role] ?? "/visitor")
}