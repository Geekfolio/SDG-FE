"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StaffDetailsForm from "@/components/auth/StaffDetailsForm"
import StudentDetailsForm from "@/components/auth/StudentDetailsForm"

export default function RoleSelectionPage() {
  const [role, setRole] = useState<"staff" | "student" | "">("")
  const [profileCompleted, setProfileCompleted] = useState(false)
  const router = useRouter()

  const handleProfileComplete = (details: Record<string, any>) => {
    sessionStorage.setItem("userDetails", JSON.stringify(details))
    setProfileCompleted(true)
  }

  useEffect(() => {
    if (profileCompleted) {
      router.push(role === "student" ? "/student-dashboard" : "/staff-dashboard")
    }
  }, [profileCompleted, role, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[90%] max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {!role ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Please select your role to continue:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="flex-1" onClick={() => setRole("staff")}>
                  I am a Staff Member
                </Button>
                <Button className="flex-1" onClick={() => setRole("student")}>
                  I am a Student
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
            </div>
          ) : (
            role === "staff" ? (
              <StaffDetailsForm onComplete={() => handleProfileComplete} />
            ) : (
              <StudentDetailsForm onComplete={() => handleProfileComplete} />
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}