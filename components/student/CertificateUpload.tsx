"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CertificateUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [hackathonName, setHackathonName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info("Uploading certificate...");
    setTimeout(() => {
      toast.success("Upload successful!");
    }, 2000);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Certificate Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <Label htmlFor="hackathonName">Hackathon Name</Label>
            <Input
              id="hackathonName"
              type="text"
              value={hackathonName}
              onChange={(e) => setHackathonName(e.target.value)}
              placeholder="Enter hackathon name"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="certificate">Upload Certificate</Label>
            <Input
              id="certificate"
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <Button type="submit">Upload Certificate</Button>
        </form>
        <ToastContainer />
      </CardContent>
    </Card>
  );
}
