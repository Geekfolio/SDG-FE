import React from "react";
import Layout from "@/components/ui/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function WorkshopPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Workshop Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Join our interactive workshop where you'll learn new skills
              through hands-on exercises, group activities, and Q&A sessions led
              by experienced professionals.
            </p>
            <p className="mt-4">
              <strong>Date:</strong> February 25, 2025
            </p>
            <p className="mt-2">
              <strong>Time:</strong> 10:00 AM - 4:00 PM
            </p>
            <p className="mt-2">
              <strong>Location:</strong> Online (via Zoom)
            </p>
            <p className="mt-2">
              <strong>Instructors:</strong> John Doe, Jane Smith
            </p>
            <p className="mt-2">
              <strong>Agenda:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>Introduction to the workshop</li>
                <li>Interactive session</li>
                <li>Hands-on exercises</li>
                <li>Q&amp;A session</li>
                <li>Wrap-up</li>
              </ul>
            </p>
            <p className="mt-2">
              <strong>Cost:</strong> Rs. 150
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
