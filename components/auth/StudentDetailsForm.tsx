"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface StudentDetailsFormProps {
  onComplete: (formData: any) => void;
}

export default function StudentDetailsForm({
  onComplete,
}: StudentDetailsFormProps) {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setTimeout(() => {
      console.log("Student profile submitted:", {
        role: "student",
        rollNumber,
        name,
        department,
        batch,
      });
      setLoading(false);
      onComplete(FormData);
    }, 1000);
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
        <div>
          <label className="block text-sm font-medium mb-1">Batch</label>
          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
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
