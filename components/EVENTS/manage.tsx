"use client";

import React, { useState } from "react";
import ReactSelect from "react-select";
import { PlusCircle, Calendar, Users, Trophy, Clock, ChevronDown } from "lucide-react";
import { Leaderboard } from "@/components/EVENTS/leaderboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const departmentOptions = [
  { value: "AIML", label: "AIML" },
  { value: "ECE", label: "ECE" },
  { value: "EEE", label: "EEE" },
  { value: "CSE", label: "CSE" },
  { value: "CYBER", label: "CYBER" },
  { value: "IT", label: "IT" },
  { value: "MECH", label: "MECH" },
  { value: "MCT", label: "MCT" },
  { value: "AIDS", label: "AIDS" },
  { value: "BIO", label: "BIO" },
  { value: "CSBS", label: "CSBS" },
  { value: "CIVIL", label: "CIVIL" },
];

const yearOptions = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: "4px",
    borderColor: "#cbd5e0",
    minHeight: "38px",
  }),
};

const liveEvents = [
  { id: 1, name: "AI Hackathon 2025", startDate: "2025-03-15T09:00", endDate: "2025-03-17T18:00", participants: 120, status: "In Progress" },
  { id: 2, name: "Web3 Challenge", startDate: "2025-04-01T10:00", endDate: "2025-04-03T17:00", participants: 85, status: "Upcoming" },
  { id: 3, name: "Data Science Showdown", startDate: "2025-05-20T08:00", endDate: "2025-05-22T20:00", participants: 150, status: "Registration Open" },
];

export function EventManagement() {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {selectedLeaderboardId && (
        <div className="border rounded-lg p-4 bg-background">
          <Button variant="ghost" onClick={() => setSelectedLeaderboardId(null)} className="mb-4 gap-1">
            <ChevronDown className="h-4 w-4 rotate-90" /> Back to Events
          </Button>
          <Leaderboard eventId={selectedLeaderboardId} />
        </div>
      )}
      {!selectedLeaderboardId && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Live Events</h2>
          <Button onClick={() => setIsCreatingEvent(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      )}
      {isCreatingEvent && <EventCreationForm onClose={() => setIsCreatingEvent(false)} />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {liveEvents.map((event) => (
          <LiveEventCard key={event.id} event={event} setSelectedLeaderboardId={setSelectedLeaderboardId} />
        ))}
      </div>
    </div>
  );
}

function EventCreationForm({ onClose }: { onClose: () => void }) {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [deptArray, setDeptArray] = useState<string[]>([]);
  const [yearArray, setYearArray] = useState<string[]>([]);
  const [eventCreatorEmail, setEventCreatorEmail] = useState("");
  const [eventStatus, setEventStatus] = useState("OPEN");

  const handleSubmit = async () => {
    // Convert datetime-local input (YYYY-MM-DDTHH:mm) into "YYYY-MM-DD HH:mm:ss" format.
    const formattedStartDate = startDate ? startDate.replace("T", " ") + ":00" : "";
    const formattedEndDate = endDate ? endDate.replace("T", " ") + ":00" : "";

    try {
      const eventData = {
        name: eventName,
        email: eventCreatorEmail,
        description: eventDescription,
        team_size: teamSize,
        event_type: eventType,
        start: formattedStartDate,
        end: formattedEndDate,
        status: eventStatus,
        departments: deptArray.map((dept) => dept.toUpperCase()),
        years: yearArray.map((year) => parseInt(year, 10)),
      };

      const response = await fetch("http://bore.pub:38409/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast.success("Event created successfully!", { position: "top-right" as ToastPosition });
        onClose();
      } else {
        toast.error("Error creating event. Please try again.", { position: "top-right" as ToastPosition });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error creating event. Something went wrong!", { position: "top-right" as ToastPosition });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>Fill in the details to create a new hackathon or coding event.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input id="event-name" placeholder="Enter event name" value={eventName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Event Description</Label>
            <Textarea id="event-description" placeholder="Describe your event" value={eventDescription} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEventDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="datetime-local" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="datetime-local" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-type">Event Type</Label>
            <Select onValueChange={(value: string) => setEventType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-size">Team Size</Label>
            <Input id="team-size" type="number" placeholder="Enter team size" value={teamSize} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamSize(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept-array">Departments</Label>
            <ReactSelect
              inputId="dept-array"
              isMulti
              options={departmentOptions}
              styles={customStyles}
              value={departmentOptions.filter((option) => deptArray.includes(option.value))}
              onChange={(selectedOptions) =>
                setDeptArray(selectedOptions ? selectedOptions.map((option) => option.value) : [])
              }
              placeholder="Select departments..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year-array">Years</Label>
            <ReactSelect
              inputId="year-array"
              isMulti
              options={yearOptions}
              styles={customStyles}
              value={yearOptions.filter((option) => yearArray.includes(option.value))}
              onChange={(selectedOptions) =>
                setYearArray(selectedOptions ? selectedOptions.map((option) => option.value) : [])
              }
              placeholder="Select years..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-creator-email">Event Creator Email</Label>
            <Input
              id="event-creator-email"
              type="email"
              placeholder="Enter event creator email"
              value={eventCreatorEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventCreatorEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-status">Event Status</Label>
            <Select onValueChange={(value: string) => setEventStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Registration Open</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create Event</Button>
      </CardFooter>
    </Card>
  );
}

function LiveEventCard({ event, setSelectedLeaderboardId }: { event: (typeof liveEvents)[number]; setSelectedLeaderboardId: (id: number) => void }) {
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
              {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleDateString()} {new Date(event.endDate).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>{event.participants} Participants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => setSelectedLeaderboardId(event.id)}>
          <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
        </Button>
      </CardFooter>
    </Card>
  );
}