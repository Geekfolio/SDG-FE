"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, GraduationCap, ArrowLeft } from "lucide-react";
import StaffDetailsForm from "@/components/auth/StaffDetailsForm";
import StudentDetailsForm from "@/components/auth/StudentDetailsForm";

export default function RoleSelectionPage() {
  const [role, setRole] = useState<"staff" | "student" | "">("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setRole(profile.role);
      setProfileCompleted(true);
    }
  }, []);

  useEffect(() => {
    if (profileCompleted) {
      router.push(
        role === "student" ? "/student-dashboard" : "/staff-dashboard",
      );
    }
  }, [profileCompleted, role, router]);

  const handleProfileComplete = async (formData: any) => {
    const profileData = {
      role,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("profile", JSON.stringify(profileData));

    if (session) {
      await update({ ...profileData });
    }

    setProfileCompleted(true);
  };

  const handleRoleSelect = (selectedRole: "staff" | "student") => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-[90%] max-w-lg shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            {!role
              ? "Choose your role to personalize your experience"
              : `Complete your ${role} profile details below`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!role ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  className="h-32 text-lg flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform"
                  onClick={() => handleRoleSelect("staff")}
                >
                  <UserRound size={32} />
                  <span>Staff Member</span>
                </Button>
                <Button
                  className="h-32 text-lg flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform"
                  onClick={() => handleRoleSelect("student")}
                >
                  <GraduationCap size={32} />
                  <span>Student</span>
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 flex items-center justify-center gap-2"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size={16} />
                Back to Home
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {role === "staff" ? (
                <StaffDetailsForm onComplete={handleProfileComplete} />
              ) : (
                <StudentDetailsForm onComplete={handleProfileComplete} />
              )}
              <Button
                variant="ghost"
                className="mt-4 w-full"
                onClick={() => setRole("")}
              >
                Choose Different Role
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
