'use client'
import React, { useState, useEffect } from "react";
import Layout from "@/components/ui/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Workshop {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  requirePayment: boolean;
  paymentLink: string;
  paymentAmount: number;
}

export default function WorkshopCreationPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [requirePayment, setRequirePayment] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdWorkshops, setCreatedWorkshops] = useState<Workshop[]>([]);

  // Load saved workshops from localStorage
  useEffect(() => {
    const savedWorkshops = localStorage.getItem("workshops");
    if (savedWorkshops) {
      setCreatedWorkshops(JSON.parse(savedWorkshops));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date || !time || !location) {
      toast.error("Please fill in all required fields", {
        position: "top-right" as ToastPosition,
      });
      return;
    }

    setIsSubmitting(true);

    const workshopData: Workshop = {
      title,
      description,
      date,
      time,
      location,
      requirePayment,
      paymentLink,
      paymentAmount,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/create-workshop`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workshopData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Workshop created successfully!", {
          position: "top-right" as ToastPosition,
        });

        // Update localStorage and state with the new workshop
        const updatedWorkshops = [workshopData, ...createdWorkshops];
        localStorage.setItem("workshops", JSON.stringify(updatedWorkshops));
        setCreatedWorkshops(updatedWorkshops);

        // Clear the form fields
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setRequirePayment(false);
        setPaymentLink("");
        setPaymentAmount(0);
      } else {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        toast.error("Error creating workshop. Please try again.", {
          position: "top-right" as ToastPosition,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error creating workshop. Something went wrong!", {
        position: "top-right" as ToastPosition,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create a Workshop</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Workshop Title
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter workshop title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border p-2"
                  rows={4}
                  placeholder="Enter workshop description"
                  required
                ></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter workshop location"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={requirePayment} onCheckedChange={setRequirePayment} />
                <span className="text-sm">Require Payment</span>
              </div>
              {requirePayment && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Link
                    </label>
                    <Input
                      type="url"
                      value={paymentLink}
                      onChange={(e) => setPaymentLink(e.target.value)}
                      placeholder="Enter payment link"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Amount
                    </label>
                    <Input
                      type="number"
                      value={paymentAmount || ""}
                      onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                      placeholder="Enter payment amount"
                      required
                    />
                  </div>
                </div>
              )}
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Creating Workshop..." : "Create Workshop"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {createdWorkshops.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Created Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              {createdWorkshops.map((workshop, index) => (
                <div key={index} className="border rounded-md p-4 mb-4">
                  <h3 className="text-xl font-semibold">{workshop.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{workshop.description}</p>
                  <div className="text-sm">
                    <span className="font-medium">Date:</span> {workshop.date}{" "}
                    <span className="font-medium ml-4">Time:</span> {workshop.time}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Location:</span> {workshop.location}
                  </div>
                  {workshop.requirePayment && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Payment:</span> {workshop.paymentAmount}{" "}
                      <a href={workshop.paymentLink} className="text-blue-500 underline">
                        {workshop.paymentLink}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}