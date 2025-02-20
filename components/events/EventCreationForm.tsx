"use client"; import React, { useState } from "react"; 
import ReactSelect from "react-select"; 
import { PlusCircle, Calendar, Users, Trophy, Clock, Tag, Eye } from "lucide-react"; 
import { Card, CardContent, CardFooter } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; 
import { Switch } from "@/components/ui/switch"; 
import { toast, ToastPosition } from "react-toastify"; import { useTheme } from "next-themes"; 
import { Badge } from "@/components/ui/badge"; import { Separator } from "@/components/ui/separator"; 
import { DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 
import "react-toastify/dist/ReactToastify.css";
import { departmentOptions, yearOptions } from "@/utils/types";

const statusColors = {
    "In Progress": "bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 border-blue-500/30",
    Upcoming: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30",
    "Registration Open": "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30",
    Completed: "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400 border-slate-500/30",
    Open: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/25 dark:text-purple-400 border-purple-500/30",
    Closed: "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400 border-red-500/30",
  };
  
  const USER_ROLE = {
    STAFF: "staff",
    PARTICIPANT: "participant",
    ADMIN: "admin",
  };

export default function ({ onClose }: { onClose: () => void }) {
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