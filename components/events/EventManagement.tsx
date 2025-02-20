"use client"; import React, { useState, useEffect } from "react"; 
import ReactSelect from "react-select"; import { PlusCircle, Calendar, Users, Trophy, Clock, ChevronDown, Search, X, Tag, CalendarClock, ActivitySquare, UserPlus, Eye, Award, FileCheck, Star, ScrollText, Mail, ExternalLink, Filter } from "lucide-react"; 
import { Leaderboard } from "@/components/events/leaderboard"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Switch } from "@/components/ui/switch"; import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; import { toast, ToastPosition } from "react-toastify"; import { useTheme } from "next-themes"; import { Badge } from "@/components/ui/badge"; import { Separator } from "@/components/ui/separator"; import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"; import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; import { Progress } from "@/components/ui/progress"; import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "react-toastify/dist/ReactToastify.css";
import { departmentOptions, yearOptions } from "@/utils/types";

// Define status colors with enhanced visual styling
const statusColors = {
  "In Progress": "bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 border-blue-500/30",
  Upcoming: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30",
  "Registration Open": "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30",
  Completed: "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400 border-slate-500/30",
  Open: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/25 dark:text-purple-400 border-purple-500/30",
  Closed: "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400 border-red-500/30",
};

// Constants for user roles
const USER_ROLE = {
  STAFF: "staff",
  PARTICIPANT: "participant",
  ADMIN: "admin",
};

export function EventManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<"leaderboard" | "participants" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userRole, setUserRole] = useState(USER_ROLE.STAFF); // Default to staff for demo
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isGradingPanel, setIsGradingPanel] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  // Fetch events and ensure hydration matching
  useEffect(() => {
    setMounted(true);
    fetch("http://localhost:8000/events")
      .then((res) => res.json())
      .then((data) => {
        // Transform every event: assign a unique id, map start/end
        const transformed = data.map((event: any, index: number) => ({
          ...event,
          id: index, // using index as key; ideally the API returns a unique id
          startDate: event.start,
          endDate: event.end,
          image: event.image
            ? event.image
            : "/hackthon.png",
          // Optionally adjust status cases for consistency
          status:
            event.status.toLowerCase() === "in progress"
              ? "In Progress"
              : event.status,
          participants: Math.floor(Math.random() * 200) + 20, // Mock data for demo
          judgesAssigned: Math.floor(Math.random() * 10) + 1, // Mock data for demo
          submissionsCount: Math.floor(Math.random() * 150) + 10, // Mock data for demo
          completionPercentage: Math.floor(Math.random() * 100), // Mock data for demo
        }));
        setEvents(transformed);
      })
      .catch((err) => {
        console.error("Error fetching events", err);
        toast.error("Failed to load events.", { position: "top-right" as ToastPosition });
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get the selected event details
  const selectedEvent = events.find(event => event.id === selectedEventId);
  
  // Helper function to determine if leaderboard is viewable
  const canViewLeaderboard = (eventStatus: string) => {
    return ['In Progress', 'Completed', 'Closed'].includes(eventStatus);
  };

  if (!mounted) {
    return null;
  }

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
                <h2 className="text-2xl font-bold tracking-tight">{selectedEvent.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                </p>
              </div>
              <Badge className={`ml-2 ${statusColors[selectedEvent.status as keyof typeof statusColors]}`}>
                {selectedEvent.status}
              </Badge>
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
                  <FileCheck className="h-4 w-4" />
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <h3 className="text-2xl font-bold">{selectedEvent.participants}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                    <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Judges</p>
                    <h3 className="text-2xl font-bold">{selectedEvent.judgesAssigned}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900">
                    <ScrollText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submissions</p>
                    <h3 className="text-2xl font-bold">{selectedEvent.submissionsCount}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Graded</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{selectedEvent.completionPercentage}%</h3>
                      <Progress value={selectedEvent.completionPercentage} className="h-2 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue={canViewLeaderboard(selectedEvent.status) ? "leaderboard" : "participants"} className="mb-8">
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
                onClick={() => {setActiveView("participants"); setIsGradingPanel(false);}}
                className="gap-2"
              >
                <Users className="h-4 w-4" /> Participants
              </TabsTrigger>
            </TabsList>
            
            {canViewLeaderboard(selectedEvent.status) && (
              <TabsContent value="leaderboard" className="mt-0">
                {activeView === "leaderboard" && <Leaderboard eventId={selectedEventId} />}
              </TabsContent>
            )}
            
            {/* <TabsContent value="participants" className="mt-0">
              {activeView === "participants" && (
                isGradingPanel ? (
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
                )
              )}
            </TabsContent> */}
          </Tabs>
        </div>
      ) : (
        <>
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
                <TabsTrigger value="Open" className="rounded-md">Active Events</TabsTrigger>
                <TabsTrigger value="Closed" className="rounded-md">Past Events</TabsTrigger>
                <TabsTrigger value="In progress" className="rounded-md">Upcoming</TabsTrigger>
              </TabsList>
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-10 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val)}
                >
                  <SelectTrigger className="w-full md:w-44 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="All statuses" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Registration Open">
                      Registration Open
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                icon={<CalendarClock className="h-12 w-12 text-muted-foreground" />}
              />
            </TabsContent>
            <TabsContent value="In progress" className="mt-0">
              <EmptyState
                title="No upcoming events"
                description="Upcoming events will be displayed here."
                icon={<ActivitySquare className="h-12 w-12 text-muted-foreground" />}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function EventCreationForm({ onClose }: { onClose: () => void }) {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [deptArray, setDeptArray] = useState<string[]>([]);
  const [yearArray, setYearArray] = useState<string[]>([]);
  const [eventCreatorEmail, setEventCreatorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [link, setLink] = useState("");
  const [points, setPoints] = useState(0);
  const [internal, setInternal] = useState(false);

  const { theme } = useTheme();

  // Custom styles for react-select
  const getSelectStyles = () => {
    return {
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: theme === "dark" ? "hsl(var(--card))" : "white",
        borderColor: state.isFocused
          ? "hsl(var(--ring))"
          : "hsl(var(--border))",
        boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
        "&:hover": {
          borderColor: "hsl(var(--ring))",
        },
        borderRadius: "var(--radius)",
        minHeight: "38px",
      }),
      menu: (provided: any) => ({
        ...provided,
        backgroundColor: theme === "dark" ? "hsl(var(--popover))" : "white",
        border: "1px solid hsl(var(--border))",
        boxShadow: "var(--shadow)",
        zIndex: 1000,
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "hsl(var(--primary))"
          : state.isFocused
            ? theme === "dark"
              ? "hsl(var(--accent))"
              : "hsl(var(--accent))"
            : "transparent",
        color: state.isSelected
          ? "hsl(var(--primary-foreground))"
          : theme === "dark"
            ? "hsl(var(--popover-foreground))"
            : "inherit",
        cursor: "pointer",
        "&:active": {
          backgroundColor: "hsl(var(--accent))",
        },
      }),
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor:
          theme === "dark" ? "hsl(var(--accent))" : "hsl(var(--accent))",
      }),
      multiValueLabel: (provided: any) => ({
        ...provided,
        color:
          theme === "dark"
            ? "hsl(var(--accent-foreground))"
            : "hsl(var(--accent-foreground))",
      }),
      multiValueRemove: (provided: any) => ({
        ...provided,
        color:
          theme === "dark"
            ? "hsl(var(--accent-foreground))"
            : "hsl(var(--accent-foreground))",
        "&:hover": {
          backgroundColor:
            theme === "dark"
              ? "hsl(var(--destructive))"
              : "hsl(var(--destructive))",
          color:
            theme === "dark"
              ? "hsl(var(--destructive-foreground))"
              : "hsl(var(--destructive-foreground))",
        },
      }),
    };
  };

  const handleSubmit = async () => {
    if (
      !eventName ||
      !eventDescription ||
      !startDate ||
      !endDate ||
      !eventCreatorEmail
    ) {
      toast.error("Please fill in all required fields", {
        position: "top-right" as ToastPosition,
      });
      return;
    }

    setIsSubmitting(true);

    const formattedStartDate = startDate.replace("T", " ") + ":00";
    const formattedEndDate = endDate.replace("T", " ") + ":00";

    try {
      const eventData = {
        name: eventName,
        creator: eventCreatorEmail,
        contact: eventCreatorEmail,
        description: eventDescription,
        team_size: teamSize,
        internal: internal,
        start: formattedStartDate,
        end: formattedEndDate,
        eligible_dept: deptArray.map((dept) => dept.toUpperCase()),
        eligible_year: yearArray.map((year) => parseInt(year, 10)),
        points: points,
        link: link,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        toast.success("Event created successfully!", {
          position: "top-right" as ToastPosition,
        });
        onClose();
      } else {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        toast.error("Error creating event. Please try again.", {
          position: "top-right" as ToastPosition,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error creating event. Something went wrong!", {
        position: "top-right" as ToastPosition,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader className="mb-6">
        <DialogTitle>Create New Event</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new hackathon or coding event.
        </DialogDescription>
      </DialogHeader>

      <form className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">
              Event Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="event-name"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">
              Event Description<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="event-description"
              placeholder="Describe your event"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">
                Start Date<span className="text-red-500">*</span>
              </Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">
                End Date<span className="text-red-500">*</span>
              </Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="team-size">Team Size</Label>
            <Input
              id="team-size"
              type="number"
              min="1"
              max="10"
              placeholder="Enter team size"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of participants per team
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-array">Eligible Departments</Label>
            <ReactSelect
              inputId="dept-array"
              isMulti
              options={departmentOptions}
              styles={getSelectStyles()}
              value={departmentOptions.filter((option) =>
                deptArray.includes(option.value),
              )}
              onChange={(selectedOptions) =>
                setDeptArray(
                  selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : [],
                )
              }
              placeholder="Select departments..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to allow all departments
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-array">Eligible Years</Label>
            <ReactSelect
              inputId="year-array"
              isMulti
              options={yearOptions}
              styles={getSelectStyles()}
              value={yearOptions.filter((option) =>
                yearArray.includes(option.value),
              )}
              onChange={(selectedOptions) =>
                setYearArray(
                  selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : [],
                )
              }
              placeholder="Select years..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to allow all years
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-link">Event Link</Label>
            <Input
              id="event-link"
              type="url"
              placeholder="Enter event link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-points">Points</Label>
            <Input
              id="event-points"
              type="number"
              placeholder="Enter points (optional)"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="internal-switch"
              checked={internal}
              onCheckedChange={(checked) => setInternal(checked as boolean)}
            />
            <Label htmlFor="internal-switch">Internal Hackathon</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">
              Contact Email for Organiser<span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Enter contact email for organiser"
              value={eventCreatorEmail}
              onChange={(e) => setEventCreatorEmail(e.target.value)}
              required
            />
          </div>

        </div>
      </form>

      <DialogFooter className="flex justify-between gap-2 mt-8">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </DialogFooter>
    </>
  );
}


function LiveEventCard({
  event,
  setSelectedEventId,
  setActiveView,
  userRole,
  onDeleteEvent
}: {
  event: any;
  setSelectedEventId: (id: number) => void;
  setActiveView: (view: "leaderboard" | "participants" | null) => void;
  userRole: string;
  onDeleteEvent?: (id: number) => void;
}) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const formattedStartDate = startDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusClass = (status: string) => {
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400 border-slate-500/30"
    );
  };

  const durationInDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const durationText =
    durationInDays === 1 ? "1 day" : `${durationInDays} days`;
    
  // Determine if leaderboard can be viewed
  const canViewLeaderboard = ['In Progress', 'Completed', 'Closed'].includes(event.status);
  
  // Styles for hover effects
  const cardHoverClass = "group hover:shadow-xl hover:scale-[1.01] transition-all duration-200";
  const imageHoverClass = "transform transition-transform duration-300 group-hover:scale-105";

  return (
    <Card className={`overflow-hidden flex flex-col h-full ${cardHoverClass}`}>
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className={`w-full h-48 object-cover ${imageHoverClass}`}
        />
        <div className="absolute top-4 right-4">
          <Badge className={`${getStatusClass(event.status)} border px-2.5 py-1 font-medium text-sm`}>
            {event.status}
          </Badge>
        </div>
        {userRole === USER_ROLE.STAFF && (
          <div className="absolute top-4 left-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm border-white/50 shadow-md hover:bg-white">
                    <PlusCircle className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
          <h3 className="text-lg font-semibold text-white line-clamp-1">{event.name}</h3>
          <div className="flex items-center gap-1 text-xs text-white/80">
            <Calendar className="h-3 w-3" />
            <span>{formattedStartDate} to {formattedEndDate}</span>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow py-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span>Duration: {durationText}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="text-muted-foreground h-4 w-4" />
            <span>{event.participants || 0} Participants</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Tag className="text-muted-foreground h-4 w-4" />
            <div className="flex flex-wrap gap-1">
              {event.tags?.map((tag: string, idx: number) => (
                <Badge
                  key={`${tag}-${idx}`}
                  variant="outline"
                  className="text-xs py-0 px-1.5 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pt-2 pb-4 flex flex-col gap-3">
        {canViewLeaderboard ? (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="w-1/2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
              onClick={() => {
                setSelectedEventId(event.id);
                setActiveView("leaderboard");
              }}
            >
              <Trophy className="mr-2 h-4 w-4" /> Leaderboard
            </Button>
            <Button
              variant="outline"
              className="w-1/2 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-400 transition-colors"
              onClick={() => {
                setSelectedEventId(event.id);
                setActiveView("participants");
              }}
            >
              <Users className="mr-2 h-4 w-4" /> Participants
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-400 transition-colors"
            onClick={() => {
              setSelectedEventId(event.id);
              setActiveView("participants");
            }}
          >
            <Users className="mr-2 h-4 w-4" /> View Participants
          </Button>
        )}
        
        {userRole === USER_ROLE.STAFF && (
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="default"
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                setSelectedEventId(event.id);
                setActiveView("participants");
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Manage Event
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  // Implement edit logic here
                  toast.info("Edit functionality coming soon!", { position: "top-right" as ToastPosition });
                }}
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (onDeleteEvent) {
                    onDeleteEvent(event.id);
                  } else {
                    toast.info("Delete functionality coming soon!", { position: "top-right" as ToastPosition });
                  }
                }}
                className="w-1/2"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-background/50 dark:bg-background/20 backdrop-blur-sm">
      {icon || (
        <ActivitySquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
      )}
      <h3 className="text-xl font-medium mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2">
        {description}
      </p>
    </div>
  );
}

// Component for participant list
function ParticipantsList({
  eventId,
  status,
  userRole,
  onGrade
}: {
  eventId: number;
  status: string;
  userRole: string;
  onGrade: (participant: any) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("all");
  
  // Mock participants data
  useEffect(() => {
    // Simulate API call to get participants
    const mockParticipants = Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`,
      team: Math.random() > 0.3 ? `Team ${Math.ceil(Math.random() * 10)}` : null,
      submissionStatus: Math.random() > 0.25 ? 
        (Math.random() > 0.5 ? "Submitted" : "Graded") : "Not Submitted",
      submissionDate: Math.random() > 0.25 ? 
        new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) : null,
      score: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : null,
      department: ["Computer Science", "Engineering", "Design", "Business"][Math.floor(Math.random() * 4)],
      avatar: `/api/placeholder/32/32`,
    }));
    setParticipants(mockParticipants);
  }, [eventId]);
  
  // Filter and search participants
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (participant.team && participant.team.toLowerCase().includes(searchQuery.toLowerCase())) ||
      participant.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterValue === "all" ||
      (filterValue === "submitted" && participant.submissionStatus === "Submitted") ||
      (filterValue === "not-submitted" && participant.submissionStatus === "Not Submitted") ||
      (filterValue === "graded" && participant.submissionStatus === "Graded");
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="rounded-md border">
      <div className="p-4 bg-muted/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-medium">Event Participants</h3>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={filterValue}
              onValueChange={setFilterValue}
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Participants</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="not-submitted">Not Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Score</TableHead>
              {userRole === USER_ROLE.STAFF && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{participant.name}</span>
                        <span className="text-xs text-muted-foreground">{participant.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{participant.team || "—"}</TableCell>
                  <TableCell>{participant.department}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        participant.submissionStatus === "Submitted"
                          ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30"
                          : participant.submissionStatus === "Graded"
                          ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400 border-slate-500/30"
                      }
                    >
                      {participant.submissionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {participant.score !== null ? participant.score : "—"}
                  </TableCell>
                  {userRole === USER_ROLE.STAFF && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {participant.submissionStatus !== "Not Submitted" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onGrade(participant)}
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                            {participant.submissionStatus === "Graded" ? "Edit Grade" : "Grade"}
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={userRole === USER_ROLE.STAFF ? 7 : 6} className="h-24 text-center">
                  No participants found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Component for grading participants
function GradingPanel({ 
  eventId,
  selectedParticipant,
  setSelectedParticipant,
  userRole
}: {
  eventId: number;
  selectedParticipant: any;
  setSelectedParticipant: (participant: any) => void;
  userRole: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentCriteria, setCurrentCriteria] = useState<any[]>([
    { id: 1, name: "Technical Execution", description: "Quality of code and implementation", maxPoints: 25, score: 0 },
    { id: 2, name: "Innovation", description: "Uniqueness and creativity of solution", maxPoints: 20, score: 0 },
    { id: 3, name: "Design", description: "User interface, experience and visual design", maxPoints: 20, score: 0 },
    { id: 4, name: "Presentation", description: "Clarity of demo and explanation", maxPoints: 15, score: 0 },
    { id: 5, name: "Impact", description: "Potential real-world application and usefulness", maxPoints: 20, score: 0 }
  ]);
  const [feedback, setFeedback] = useState("");
  
  // Mock participants data
  useEffect(() => {
    // Simulate API call to get participants with submissions
    const mockParticipants = Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`,
      team: Math.random() > 0.3 ? `Team ${Math.ceil(Math.random() * 10)}` : null,
      submissionStatus: Math.random() > 0.3 ? "Submitted" : "Graded",
      submissionTitle: `Project ${["Innovate", "Transform", "Disrupt", "Automate", "Simplify"][Math.floor(Math.random() * 5)]}`,
      submissionDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
      score: Math.random() > 0.3 ? Math.floor(Math.random() * 100) : null,
      avatar: `/api/placeholder/32/32`,
    }));
    setParticipants(mockParticipants.filter(p => p.submissionStatus !== "Not Submitted"));
  }, [eventId]);
  
  // Calculate total score
  const totalScore = currentCriteria.reduce((sum, criterion) => sum + criterion.score, 0);
  const totalPossible = currentCriteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0);
  
  // Set scores for criteria
  const updateCriteriaScore = (id: number, score: number) => {
    setCurrentCriteria(
      currentCriteria.map(criterion => 
        criterion.id === id 
          ? { ...criterion, score: Math.min(criterion.maxPoints, Math.max(0, score)) }
          : criterion
      )
    );
  };
  
  // Filter participants by search
  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (participant.team && participant.team.toLowerCase().includes(searchQuery.toLowerCase())) ||
    participant.submissionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left sidebar - Participants list */}
      <div className="md:col-span-1">
        <div className="border rounded-md overflow-hidden bg-card">
          <div className="p-4 border-b">
            <h3 className="font-medium">Submissions</h3>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            <Command>
              <CommandList>
                <CommandGroup>
                  {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((participant) => (
                      <CommandItem
                        key={participant.id}
                        onSelect={() => setSelectedParticipant(participant)}
                        className={`py-3 px-4 cursor-pointer ${
                          selectedParticipant?.id === participant.id ? 
                            "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow space-y-1 truncate">
                            <div className="flex justify-between items-start">
                              <span className="font-medium truncate">{participant.name}</span>
                              <Badge
                                variant="outline"
                                className={
                                  participant.submissionStatus === "Graded"
                                    ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30"
                                }
                              >
                                {participant.submissionStatus}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {participant.submissionTitle}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {participant.submissionDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      No submissions found
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </div>
      
      {/* Right panel - Grading interface */}
      <div className="md:col-span-2">
        {selectedParticipant ? (
          <div className="border rounded-md p-6 bg-card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedParticipant.submissionTitle}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedParticipant.avatar} />
                    <AvatarFallback>{selectedParticipant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {selectedParticipant.name} 
                    {selectedParticipant.team && ` (${selectedParticipant.team})`}
                  </span>
                </div>
              </div>
              <Badge
                className={
                  selectedParticipant.submissionStatus === "Graded"
                    ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30"
                }
              >
                {selectedParticipant.submissionStatus}
              </Badge>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Evaluation Criteria</h3>
              <div className="space-y-4">
                {currentCriteria.map((criterion) => (
                  <div key={criterion.id} className="border rounded-md p-4 bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{criterion.name}</h4>
                        <p className="text-sm text-muted-foreground">{criterion.description}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Max: {criterion.maxPoints} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <Input
                        type="number"
                        min="0"
                        max={criterion.maxPoints}
                        value={criterion.score}
                        onChange={(e) => updateCriteriaScore(criterion.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between text-xs mb-1">
                          <span>0</span>
                          <span>{criterion.maxPoints}</span>
                        </div>
                        <div className="relative pt-1">
                          <input
                            type="range"
                            min="0"
                            max={criterion.maxPoints}
                            value={criterion.score}
                            onChange={(e) => updateCriteriaScore(criterion.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Feedback</h3>
              <Textarea
                placeholder="Provide detailed feedback to the participant..."
                className="min-h-32"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">
                  {totalScore} <span className="text-muted-foreground text-sm font-normal">/ {totalPossible}</span>
                </div>
                <Progress 
                  value={(totalScore / totalPossible) * 100} 
                  className={`w-32 h-3 ${
                    totalScore / totalPossible >= 0.7 
                      ? "[&>div]:bg-emerald-500" 
                      : totalScore / totalPossible >= 0.4 
                      ? "[&>div]:bg-amber-500" 
                      : "[&>div]:bg-red-500"
                  }`}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button 
                  className="gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => {
                    toast.success("Grades submitted successfully!", { position: "top-right" as ToastPosition });
                    setSelectedParticipant({
                      ...selectedParticipant,
                      submissionStatus: "Graded",
                      score: totalScore
                    });
                  }}
                >
                  <FileCheck className="h-4 w-4" />
                  Submit Evaluation
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center bg-card h-full">
            <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Select a Submission</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              Select a submission from the list to view details and assign scores
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
