"use client";

import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { PlusCircle, Calendar, Users, Trophy, Clock, ChevronDown, Sun, Moon, Filter, Search, X, Tag, CalendarClock, ActivitySquare } from "lucide-react";
import { Leaderboard } from "@/components/EVENTS/leaderboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, ToastPosition } from "react-toastify";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
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

// Define status colors
const statusColors = {
  "In Progress": "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
  "Upcoming": "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
  "Registration Open": "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
  "Completed": "bg-slate-500/10 text-slate-500 dark:bg-slate-500/20"
};

// Mock data
const liveEvents = [
  { 
    id: 1, 
    name: "AI Hackathon 2025", 
    startDate: "2025-03-15T09:00", 
    endDate: "2025-03-17T18:00", 
    participants: 120, 
    status: "In Progress",
    image: "/hackthon.png",
    description: "Build innovative solutions using artificial intelligence and machine learning.",
    organizer: "Department of Computer Science",
    tags: ["AI", "Machine Learning", "Innovation"]
  },
  { 
    id: 2, 
    name: "Web3 Challenge", 
    startDate: "2025-04-01T10:00", 
    endDate: "2025-04-03T17:00", 
    participants: 85, 
    status: "Upcoming",
    image: "/web3.png",
    description: "Develop decentralized applications on blockchain technology platforms.",
    organizer: "Blockchain Club",
    tags: ["Blockchain", "Crypto", "DApps"]
  },
  { 
    id: 3, 
    name: "Data Science Showdown", 
    startDate: "2025-05-20T08:00", 
    endDate: "2025-05-22T20:00", 
    participants: 150, 
    status: "Registration Open",
    image: "/data.png",
    description: "Solve complex data problems and create powerful visualizations.",
    organizer: "AI & Data Science Department",
    tags: ["Data Science", "Analytics", "Visualization"]
  },
  { 
    id: 4, 
    name: "UI/UX Design Jam", 
    startDate: "2025-06-10T09:00", 
    endDate: "2025-06-11T18:00", 
    participants: 72, 
    status: "Registration Open",
    image: "/ui-ux.png",
    description: "Design innovative interfaces and user experiences for real-world problems.",
    organizer: "Design Department",
    tags: ["Design", "UI/UX", "Prototyping"]
  },
  { 
    id: 5, 
    name: "IoT Innovation Challenge", 
    startDate: "2025-02-01T10:00", 
    endDate: "2025-02-05T17:00", 
    participants: 95, 
    status: "Completed",
    image: "/iot.png",
    description: "Create innovative IoT solutions for smart cities and sustainable living.",
    organizer: "Electronics Department",
    tags: ["IoT", "Hardware", "Smart Tech"]
  },
];

export function EventManagement() {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration matching
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredEvents = liveEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl transition-colors duration-200">
      {selectedLeaderboardId ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <Button variant="ghost" onClick={() => setSelectedLeaderboardId(null)} className="mb-6 group hover:bg-accent">
            <ChevronDown className="h-4 w-4 rotate-90 mr-2 group-hover:translate-x-0.5 transition-transform" /> 
            Back to Events
          </Button>
          <Leaderboard eventId={selectedLeaderboardId} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Event Management</h1>
              <p className="text-muted-foreground">Create, manage, and track events for your organization</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <EventCreationForm onClose={() => setIsCreatingEvent(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="active" className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="mb-0">
                <TabsTrigger value="active">Active Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search events..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" 
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                  <SelectTrigger className="w-full md:w-44">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="All statuses" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Registration Open">Registration Open</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="active" className="mt-0">
              {filteredEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <LiveEventCard 
                      key={event.id} 
                      event={event} 
                      setSelectedLeaderboardId={setSelectedLeaderboardId}
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
            <TabsContent value="past" className="mt-0">
              <EmptyState 
                title="No past events" 
                description="Past events will be displayed here."
                icon={<CalendarClock className="h-12 w-12 text-muted-foreground" />}
              />
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0">
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
  const [eventType, setEventType] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [deptArray, setDeptArray] = useState<string[]>([]);
  const [yearArray, setYearArray] = useState<string[]>([]);
  const [eventCreatorEmail, setEventCreatorEmail] = useState("");
  const [eventStatus, setEventStatus] = useState("OPEN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useTheme();

  // Custom styles for react-select
  const getSelectStyles = () => {
    return {
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'white',
        borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))',
        boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--ring))' : 'none',
        '&:hover': {
          borderColor: 'hsl(var(--ring))'
        },
        borderRadius: 'var(--radius)',
        minHeight: '38px',
      }),
      menu: (provided: any) => ({
        ...provided,
        backgroundColor: theme === 'dark' ? 'hsl(var(--popover))' : 'white',
        border: '1px solid hsl(var(--border))',
        boxShadow: 'var(--shadow)',
        zIndex: 1000,
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected 
          ? 'hsl(var(--primary))' 
          : state.isFocused 
            ? theme === 'dark' ? 'hsl(var(--accent))' : 'hsl(var(--accent))' 
            : 'transparent',
        color: state.isSelected 
          ? 'hsl(var(--primary-foreground))' 
          : theme === 'dark' ? 'hsl(var(--popover-foreground))' : 'inherit',
        cursor: 'pointer',
        '&:active': {
          backgroundColor: 'hsl(var(--accent))',
        },
      }),
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: theme === 'dark' ? 'hsl(var(--accent))' : 'hsl(var(--accent))',
      }),
      multiValueLabel: (provided: any) => ({
        ...provided,
        color: theme === 'dark' ? 'hsl(var(--accent-foreground))' : 'hsl(var(--accent-foreground))',
      }),
      multiValueRemove: (provided: any) => ({
        ...provided,
        color: theme === 'dark' ? 'hsl(var(--accent-foreground))' : 'hsl(var(--accent-foreground))',
        '&:hover': {
          backgroundColor: theme === 'dark' ? 'hsl(var(--destructive))' : 'hsl(var(--destructive))',
          color: theme === 'dark' ? 'hsl(var(--destructive-foreground))' : 'hsl(var(--destructive-foreground))',
        },
      }),
    };
  };

  const handleSubmit = async () => {
    if (!eventName || !eventDescription || !startDate || !endDate || !eventType || !eventCreatorEmail) {
      toast.error("Please fill in all required fields", { position: "top-right" as ToastPosition });
      return;
    }

    setIsSubmitting(true);

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

      // Simulate API call for demo purposes
      setTimeout(() => {
        toast.success("Event created successfully!", { position: "top-right" as ToastPosition });
        setIsSubmitting(false);
        onClose();
      }, 1500);

      const response = await fetch("http://localhost:8080/events/create", {
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
            <Label htmlFor="event-name">Event Name<span className="text-red-500">*</span></Label>
            <Input
              id="event-name"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-description">Event Description<span className="text-red-500">*</span></Label>
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
              <Label htmlFor="start-date">Start Date<span className="text-red-500">*</span></Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date<span className="text-red-500">*</span></Label>
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
            <Label htmlFor="event-type">Event Type<span className="text-red-500">*</span></Label>
            <Select onValueChange={(value: string) => setEventType(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="coding-challenge">Coding Challenge</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
              </SelectContent>
            </Select>
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
            <p className="text-sm text-muted-foreground">Maximum number of participants per team</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dept-array">Eligible Departments</Label>
            <ReactSelect
              inputId="dept-array"
              isMulti
              options={departmentOptions}
              styles={getSelectStyles()}
              value={departmentOptions.filter((option) => deptArray.includes(option.value))}
              onChange={(selectedOptions) =>
                setDeptArray(selectedOptions ? selectedOptions.map((option) => option.value) : [])
              }
              placeholder="Select departments..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <p className="text-sm text-muted-foreground">Leave empty to allow all departments</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year-array">Eligible Years</Label>
            <ReactSelect
              inputId="year-array"
              isMulti
              options={yearOptions}
              styles={getSelectStyles()}
              value={yearOptions.filter((option) => yearArray.includes(option.value))}
              onChange={(selectedOptions) =>
                setYearArray(selectedOptions ? selectedOptions.map((option) => option.value) : [])
              }
              placeholder="Select years..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <p className="text-sm text-muted-foreground">Leave empty to allow all years</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-creator-email">Event Creator Email<span className="text-red-500">*</span></Label>
            <Input
              id="event-creator-email"
              type="email"
              placeholder="Enter event creator email"
              value={eventCreatorEmail}
              onChange={(e) => setEventCreatorEmail(e.target.value)}
              required
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
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
      
      <DialogFooter className="flex justify-between gap-2 mt-8">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </DialogFooter>
    </>
  );
}

function LiveEventCard({ 
  event, 
  setSelectedLeaderboardId 
}: { 
  event: (typeof liveEvents)[number]; 
  setSelectedLeaderboardId: (id: number) => void 
}) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const formattedStartDate = startDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedEndDate = endDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedStartTime = startDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedEndTime = endDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusClass = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-slate-500/10 text-slate-500 dark:bg-slate-500/20";
  };

  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const durationText = durationInDays === 1 ? "1 day" : `${durationInDays} days`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className={`${getStatusClass(event.status)}`}>
            {event.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-xl font-semibold line-clamp-2">{event.name}</CardTitle>
          <CardDescription className="flex items-center text-sm gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedStartDate} to {formattedEndDate}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span>Duration: {durationText}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="text-muted-foreground h-4 w-4" />
            <span>{event.participants} Participants</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Tag className="text-muted-foreground h-4 w-4" />
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs py-0 px-1.5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <Separator className="my-2" />
      
      <CardFooter className="pt-2 pb-4 flex flex-col gap-3">
        <Button 
          variant="outline" 
          className="w-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-colors"
          onClick={() => setSelectedLeaderboardId(event.id)}
        >
          <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState({ 
  title, 
  description,
  icon
}: { 
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-background/50">
      {icon || <ActivitySquare className="h-12 w-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-medium mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2">{description}</p>
    </div>
  );
}