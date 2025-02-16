"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Event {
  id: number;
  name: string;
  email: string;
  description: string;
  event_type: string;
  team_size: number;
  start: string;
  end: string;
  participants: number;
  status: string;
  authority: number;
}

export default function StudentEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Registration state fields
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [teamEmail, setTeamEmail] = useState("");

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/events/all");
        if (res.ok) {
          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (error) {
            const fixedText = text.replace(/'/g, '"');
            data = JSON.parse(fixedText);
          }
          console.log("Fetched events:", data);
          setEvents(data);
        } else {
          toast.error("Error fetching events", { position: "top-right" as ToastPosition });
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events", { position: "top-right" as ToastPosition });
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async () => {
    if (!selectedEvent) return;

    const payload = {
      email: teamEmail,
      team_name: teamName,
      team_members: teamMembers,
      event_name: selectedEvent.name,
      event_date: selectedEvent.start,
    };

    try {
      const res = await fetch("http://localhost:8080/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Registration successful! Check your email for confirmation.", {
          position: "top-right" as ToastPosition,
        });
        setTeamName("");
        setTeamMembers("");
        setTeamEmail("");
        setSelectedEvent(null);
      } else {
        toast.error("Error during registration.", { position: "top-right" as ToastPosition });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error during registration.", { position: "top-right" as ToastPosition });
    }
  };

  return (
    <div className="space-y-8 px-4 py-6 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-4">Hackathon Events</h2>
      {selectedEvent ? (
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Register for: {selectedEvent.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="team-members">Team Members</Label>
                <Input
                  id="team-members"
                  placeholder="Enter team members (comma-separated)"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="team-email">Your Email</Label>
                <Input
                  id="team-email"
                  type="email"
                  placeholder="Enter your email"
                  value={teamEmail}
                  onChange={(e) => setTeamEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Back
            </Button>
            <Button onClick={handleRegister}>Submit Registration</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events
            .filter((ev) => {
              const status = ev.status.toUpperCase();
              return status === "OPEN" || status === "REGISTRATION OPEN";
            })
            .map((ev) => (
              <Card key={ev.id} className="shadow hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{ev.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {new Date(ev.start).toLocaleDateString()} -{" "}
                    {new Date(ev.end).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1">Status: {ev.status}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setSelectedEvent(ev)}>Register</Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}