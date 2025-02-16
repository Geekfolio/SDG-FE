"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface StaffDetailsFormProps {
  onComplete: (formData: any) => void;
}

export default function StaffDetailsForm({
  onComplete,
}: StaffDetailsFormProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    /*
      --- MOCK REQUEST ---
      POST /user/update-profile
      Request Schema:
      {
        "userId": string, // fetched from session in a real app
        "role": "staff",
        "name": string,
        "email": string,
        "department": string
      }
      Expected Response:
      {
        "success": true,
        "data": {
          "userId": string,
          "name": string,
          "email": string,
          "department": string
        }
      }
    */
    setTimeout(() => {
      const resp = {
        role: "staff",
        name: name,
        department: department,
        email: session?.user.email,
      };
      console.log("Staff profile submitted:", JSON.stringify(resp));
      // localStorage.setItem("profile", JSON.stringify(resp));
      setLoading(false);
      onComplete(resp);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Staff Details</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
