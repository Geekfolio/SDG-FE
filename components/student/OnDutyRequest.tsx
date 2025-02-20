"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "../ui/card";
import { CardHeader } from "../ui/card";
import { CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export default function OnDutyRequest() {
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate the upload with a toast notification.
    toast.success("On Duty Request submitted successfully!");
    // Optionally reset the form
    setReason("");
    setProof(null);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>On Duty Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for on duty"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="proof">Proof (Image)</Label>
            <Input
              id="proof"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button type="submit">Submit Request</Button>
        </form>
      </CardContent>
      <ToastContainer />
    </Card>
  );
}
