"use client";

import { useState } from "react";
import { PlusCircle, Calendar, Users, Trophy, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Mock data for live events
const liveEvents = [
  {
    id: 1,
    name: "AI Hackathon 2025",
    startDate: "2025-03-15T09:00",
    endDate: "2025-03-17T18:00",
    participants: 120,
    status: "In Progress",
  },
  {
    id: 2,
    name: "Web3 Challenge",
    startDate: "2025-04-01T10:00",
    endDate: "2025-04-03T17:00",
    participants: 85,
    status: "Upcoming",
  },
  {
    id: 3,
    name: "Data Science Showdown",
    startDate: "2025-05-20T08:00",
    endDate: "2025-05-22T20:00",
    participants: 150,
    status: "Registration Open",
  },
];

export function EventManagement() {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Live Events</h2>
        <Button onClick={() => setIsCreatingEvent(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {isCreatingEvent && (
        <EventCreationForm onClose={() => setIsCreatingEvent(false)} />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {liveEvents.map((event) => (
          <LiveEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCreationForm({ onClose }: { onClose: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill in the details to create a new hackathon or coding event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input id="event-name" placeholder="Enter event name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Event Description</Label>
            <Textarea
              id="event-description"
              placeholder="Describe your event"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="datetime-local" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-type">Event Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="coding-challenge">
                  Coding Challenge
                </SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="live-tracking" />
            <Label htmlFor="live-tracking">Enable Live Tracking</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button>Create Event</Button>
      </CardFooter>
    </Card>
  );
}

function LiveEventCard({ event }: { event: (typeof liveEvents)[number] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {new Date(event.startDate).toLocaleTimeString()} -{" "}
              {new Date(event.endDate).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>{event.participants} Participants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
        </Button>
      </CardFooter>
    </Card>
  );
}
