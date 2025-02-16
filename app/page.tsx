"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import StaffDetailsForm from "@/components/auth/StaffDetailsForm";
import StudentDetailsForm from "@/components/auth/StudentDetailsForm";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"staff" | "student" | "">("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const router = useRouter();
  let content: React.ReactNode = null;

  if (status === "loading") {
    content = <p className="text-center py-10">Loading…</p>;
  } else if (!session) {
    content = (
      <div className="flex items-center justify-center h-screen">
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
      </div>
    );
  } else if (!profileCompleted) {
    content = !role ? (
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
        <p className="mb-4">Please select your role:</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setRole("staff")}>Staff</Button>
          <Button onClick={() => setRole("student")}>Student</Button>
        </div>
      </div>
    ) : role === "staff" ? (
      <StaffDetailsForm onComplete={() => setProfileCompleted(true)} />
    ) : (
      <StudentDetailsForm onComplete={() => setProfileCompleted(true)} />
    );
  }

  useEffect(() => {
    if (profileCompleted) {
      router.push(role === "student" ? "/student-dashboard" : "/staff-dashboard");
    }
  }, [profileCompleted, role, router]);

  return (
    <Layout>
      {content}
    </Layout>
  );
}
