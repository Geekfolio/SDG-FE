"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Calendar,
  Users,
  Trophy,
  Clock,
  ChevronDown,
  Search,
  X,
  Filter,
  Mail,
} from "lucide-react";
import { toast, ToastPosition } from "react-toastify";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { Leaderboard } from "@/components/events/leaderboard";
import LiveEventCard from "@/components/events/LiveEventCard";
import EmptyState from "@/components/events/EmptyState";
import ParticipantsList from "@/components/events/ParticipantsList";
import GradingPanel from "@/components/events/GradingPanel";
import EventCreationForm from "@/components/events/EventCreationForm";
import { DialogContent, DialogTrigger, Dialog } from "../ui/dialog";

// Constants and helper values
const statusColors = {
  "In Progress":
    "bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 border-blue-500/30",
  Upcoming:
    "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30",
  "Registration Open":
    "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30",
  Completed:
    "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400 border-slate-500/30",
  Open: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/25 dark:text-purple-400 border-purple-500/30",
  Closed:
    "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400 border-red-500/30",
};

const USER_ROLE = {
  STAFF: "staff",
  PARTICIPANT: "participant",
  ADMIN: "admin",
};

export default function EventManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<
    "leaderboard" | "participants" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userRole, setUserRole] = useState(USER_ROLE.STAFF); // Default to staff
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // For grading panel
  const [isGradingPanel, setIsGradingPanel] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((event: any, index: number) => ({
          ...event,
          id: index, // Ideally, use API-provided id
          startDate: event.start,
          endDate: event.end,
          image: event.image ? event.image : "/hackthon.png",
          status:
            event.status.toLowerCase() === "in progress"
              ? "In Progress"
              : event.status,
          participants: Math.floor(Math.random() * 200) + 20, // demo value
          judgesAssigned: Math.floor(Math.random() * 10) + 1,
          submissionsCount: Math.floor(Math.random() * 150) + 10,
          completionPercentage: Math.floor(Math.random() * 100),
        }));
        setEvents(transformed);
      })
      .catch((err) => {
        console.error("Error fetching events", err);
        toast.error("Failed to load events.", {
          position: "top-right" as ToastPosition,
        });
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const canViewLeaderboard = (eventStatus: string) =>
    ["In Progress", "Completed", "Closed"].includes(eventStatus);

  if (!mounted) return null;

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    setActiveView(null);
    setIsGradingPanel(false);
    setSelectedParticipant(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl transition-colors duration-200">
      {selectedEventId && selectedEvent ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          {/* Event header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleBackToEvents}
                className="group hover:bg-accent"
              >
                <ChevronDown className="h-4 w-4 rotate-90 mr-2 group-hover:translate-x-0.5 transition-transform" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {selectedEvent.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {new Date(selectedEvent.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedEvent.endDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`ml-2 ${statusColors[selectedEvent.status as keyof typeof statusColors]} rounded-md px-2 py-1 text-sm font-medium`}
              >
                {selectedEvent.status}
              </span>
            </div>
            {userRole === USER_ROLE.STAFF && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    setActiveView("participants");
                    setIsGradingPanel(true);
                  }}
                >
                  Grade Submissions
                </Button>
                <Button
                  variant="default"
                  className="gap-1 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Mail className="h-4 w-4" />
                  Notify Participants
                </Button>
              </div>
            )}
          </div>

          {/* Event statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* ... Render cards as before ... */}
          </div>

          <Tabs
            defaultValue={
              canViewLeaderboard(selectedEvent.status)
                ? "leaderboard"
                : "participants"
            }
            className="mb-8"
          >
            <TabsList className="mb-6">
              {canViewLeaderboard(selectedEvent.status) && (
                <TabsTrigger
                  value="leaderboard"
                  onClick={() => setActiveView("leaderboard")}
                  className="gap-2"
                >
                  <Trophy className="h-4 w-4" /> Leaderboard
                </TabsTrigger>
              )}
              <TabsTrigger
                value="participants"
                onClick={() => {
                  setActiveView("participants");
                  setIsGradingPanel(false);
                }}
                className="gap-2"
              >
                <Users className="h-4 w-4" /> Participants
              </TabsTrigger>
            </TabsList>

            {canViewLeaderboard(selectedEvent.status) && (
              <TabsContent value="leaderboard" className="mt-0">
                {activeView === "leaderboard" && (
                  <Leaderboard eventId={selectedEventId} />
                )}
              </TabsContent>
            )}

            <TabsContent value="participants" className="mt-0">
              {activeView === "participants" &&
                (isGradingPanel ? (
                  <GradingPanel
                    eventId={selectedEventId}
                    selectedParticipant={selectedParticipant}
                    setSelectedParticipant={setSelectedParticipant}
                    userRole={userRole}
                  />
                ) : (
                  <ParticipantsList
                    eventId={selectedEventId}
                    status={selectedEvent.status}
                    userRole={userRole}
                    onGrade={(participant) => {
                      setSelectedParticipant(participant);
                      setIsGradingPanel(true);
                    }}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <>
          {/* Main event list view */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Event Management
              </h1>
              <p className="text-muted-foreground">
                Create, manage, and track events for your organization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <EventCreationFormModal
                isCreatingEvent={isCreatingEvent}
                setIsCreatingEvent={setIsCreatingEvent}
              />
              {userRole === USER_ROLE.ADMIN && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Manage Staff</DropdownMenuItem>
                    <DropdownMenuItem>Access Controls</DropdownMenuItem>
                    <DropdownMenuItem>Event Templates</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <Tabs defaultValue="Open" className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="mb-0 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <TabsTrigger value="Open" className="rounded-md">
                  Active Events
                </TabsTrigger>
                <TabsTrigger value="Closed" className="rounded-md">
                  Past Events
                </TabsTrigger>
                <TabsTrigger value="In progress" className="rounded-md">
                  Upcoming
                </TabsTrigger>
              </TabsList>
              {/* <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <InputSearch
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                />
                <SelectStatus
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                />
              </div> */}
            </div>

            <TabsContent value="Open" className="mt-0">
              {filteredEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <LiveEventCard
                      key={event.id}
                      event={event}
                      setSelectedEventId={setSelectedEventId}
                      setActiveView={setActiveView}
                      userRole={userRole}
                      // You can pass onDeleteEvent callback if implemented
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No events found"
                  description="Try adjusting your search or filters, or create a new event."
                />
              )}
            </TabsContent>
            <TabsContent value="Closed" className="mt-0">
              <EmptyState
                title="No past events"
                description="Past events will be displayed here."
                icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
              />
            </TabsContent>
            <TabsContent value="In progress" className="mt-0">
              <EmptyState
                title="No upcoming events"
                description="Upcoming events will be displayed here."
                icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function EventCreationFormModal({
  isCreatingEvent,
  setIsCreatingEvent,
}: {
  isCreatingEvent: boolean;
  setIsCreatingEvent: (open: boolean) => void;
}) {
  return (
    <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
          <PlusCircle className="h-4 w-4" /> Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <EventCreationForm onClose={() => setIsCreatingEvent(false)} />
      </DialogContent>
    </Dialog>
  );
}
