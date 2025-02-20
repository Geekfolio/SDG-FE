"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">On Duty Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium mb-1">
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason for on duty"
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="proof" className="block text-sm font-medium mb-1">
            Proof (Image)
          </label>
          <input
            id="proof"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Request
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
