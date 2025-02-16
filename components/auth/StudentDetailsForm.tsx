"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface StudentDetailsFormProps {
  onComplete: (formData: any) => void;
}

export default function StudentDetailsForm({
  onComplete,
}: StudentDetailsFormProps) {
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let regex = /.([a-z]+)(\d{4})@/;
    let email = session?.user.email!;
    let name = session?.user.name!;
    let temp = name.split(" ");
    temp.pop();
    let newname = temp.join(" ");
    if (!email) {
      console.error("EMAIL UNDEFINED WTF");
      return;
    }
    const match = email.match(regex);
    if (match) {
      const department = match[1].toUpperCase();
      const year = parseInt(match[2]);
      console.log(`Name: ${newname}, Department: ${department}, Year: ${year}`);
      const resp = {
        role: "student",
        rollNumber: rollNumber,
        name: newname,
        department: department,
        batch: year,
      };
      setTimeout(() => {
        console.log("Student profile submitted:", JSON.stringify(resp));
        // localStorage.setItem("profile", JSON.stringify(resp));
        setLoading(false);
        onComplete(resp);
      }, 1000);
    } else {
      console.log(`No match for: ${email}`);
    }

    /*
      --- MOCK REQUEST ---
      POST /user/update-profile
      Request Schema:
      {
        "userId": string, // fetched from session in a real app
        "role": "student",
        "rollNumber": string,
        "name": string,
        "department": string,
        "batch": string
      }
      Expected Response:
      {
        "success": true,
        "data": {
          "userId": string,
          "rollNumber": string,
          "name": string,
          "department": string,
          "batch": string
        }
      }
    */
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Student Details</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Roll Number</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
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
