"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Calendar,
  Clock,
  Users,
  Award,
  ArrowLeft,
  Globe,
  Briefcase,
  Check,
  Ban,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";

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
  organization?: string;
  logo?: string;
  prizes?: string;
  registrations_filled?: number;
  internal: boolean;
  link?: string;
}

export default function ProfessionalEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedEvent) {
      // For external hackathons (internal===false) require audit verification.
      setCanSubmit(selectedEvent.internal ? true : false);
    }
  }, [selectedEvent]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();

  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [feedbackEvent, setFeedbackEvent] = useState<Event | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(true);

  // Registration state fields
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [teamEmail, setTeamEmail] = useState(session?.user.email!);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({
    teamName: "",
    teamMembers: "",
    teamEmail: "",
    acceptedTerms: "",
  });

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/events`,
        );
        if (res.ok) {
          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (error) {
            const fixedText = text.replace(/'/g, '"');
            data = JSON.parse(fixedText);
          }

          // Adding sample data for demo purposes
          const enhancedData = data.map((event: Event) => ({
            ...event,
            organization:
              event.organization ||
              ["TechCorp", "Microsoft", "Google", "Amazon", "IEEE"][
                Math.floor(Math.random() * 5)
              ],
            logo: event.logo,
            prizes:
              event.prizes || "$" + (Math.floor(Math.random() * 10) + 1) * 1000,
            registrations_filled:
              event.registrations_filled || Math.floor(Math.random() * 80) + 10,
          }));

          console.log("Fetched events:", enhancedData);
          setEvents(enhancedData);
        } else {
          toast.error("Error fetching events", {
            position: "top-right" as ToastPosition,
          });
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events", {
          position: "top-right" as ToastPosition,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (filter === "registered" && session?.user?.email) {
      const fetchRegisteredEvents = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/registrations?email=${session.user.email}`,
          );
          if (res.ok) {
            const text = await res.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch (error) {
              data = JSON.parse(text.replace(/'/g, '"'));
            }
            const enhancedRegisteredEvents = data.map((event: Event) => ({
              ...event,
              organization:
                event.organization ||
                ["TechCorp", "Microsoft", "Google", "Amazon", "IEEE"][
                  Math.floor(Math.random() * 5)
                ],
              logo: event.logo,
              prizes:
                event.prizes ||
                "$" + (Math.floor(Math.random() * 10) + 1) * 1000,
              registrations_filled:
                event.registrations_filled ||
                Math.floor(Math.random() * 80) + 10,
            }));
            setRegisteredEvents(enhancedRegisteredEvents);
          } else {
            toast.error("Failed to fetch registered events", {
              position: "top-right" as ToastPosition,
            });
          }
        } catch (error) {
          console.error("Error fetching registered events:", error);
          toast.error("Error fetching registered events", {
            position: "top-right" as ToastPosition,
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchRegisteredEvents();
    }
  }, [filter, session?.user?.email]);

  useEffect(() => {
    const handleAuditMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "AUDIT_RESULT") {
        const auditResult = event.data?.data?.result;
        if (auditResult === true) {
          setCanSubmit(true);
          toast.success("Audit verification passed. You may now submit.");
        } else {
          setCanSubmit(false);
          toast.error("Audit verification failed. Please try again.");
        }
      }
    };

    window.addEventListener("message", handleAuditMessage);
    return () => window.removeEventListener("message", handleAuditMessage);
  }, []);

  const validateForm = () => {
    let valid = true;
    const errors = {
      teamName: "",
      teamMembers: "",
      teamEmail: "",
      acceptedTerms: "",
    };

    if (!teamName.trim()) {
      errors.teamName = "Team name is required";
      valid = false;
    }

    if (!teamMembers.trim()) {
      errors.teamMembers = "Team members are required";
      valid = false;
    }

    if (!teamEmail.trim()) {
      errors.teamEmail = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(teamEmail)) {
      errors.teamEmail = "Invalid email format";
      valid = false;
    }

    if (!acceptedTerms) {
      errors.acceptedTerms = "You must accept the terms and conditions";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleRegister = async () => {
    if (!selectedEvent || !validateForm()) return;

    const payload = {
      student_mail: teamEmail,
      team_name: teamName,
      team_members: teamMembers,
      event_name: selectedEvent.name,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        toast.success(
          "Registration successful! Check your email for confirmation.",
          {
            position: "top-right" as ToastPosition,
          },
        );
        setTeamName("");
        setTeamMembers("");
        console.log("EMAIL", session?.user.email);
        setTeamEmail(session?.user.email!);
        setSelectedEvent(null);
      } else {
        toast.error("Error during registration.", {
          position: "top-right" as ToastPosition,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error during registration.", {
        position: "top-right" as ToastPosition,
      });
    }
  };

  const handleVerifySubmission = () => {
    if (selectedEvent?.link) {
      window.postMessage(
        {
          type: "AUDIT_REQUEST",
          url: selectedEvent.link,
        },
        "*",
      );
    } else {
      toast.error("Hackathon URL not available for audit.");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackEvent) return;
    const payload = {
      event_name: feedbackEvent.name,
      student_mail: session?.user?.email,
      rating,
      review: feedbackText,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        toast.success("Feedback submitted successfully", {
          position: "top-right" as ToastPosition,
        });
        setFeedbackEvent(null);
        setRating(0);
        setFeedbackText("");
      } else {
        toast.error("Feedback submission failed", {
          position: "top-right" as ToastPosition,
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Feedback submission failed", {
        position: "top-right" as ToastPosition,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("open")) return "success";
    if (statusLower.includes("close")) return "destructive";
    if (statusLower.includes("soon")) return "warning";
    return "secondary";
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("open")) return <Check className="h-3 w-3" />;
    if (statusLower.includes("close")) return <Ban className="h-3 w-3" />;
    return null;
  };

  const filteredEvents = events.filter((ev) => {
    // Filter by status
    const status = ev.status.toLowerCase();
    if (filter === "open" && !status.includes("open")) return false;
    if (filter === "closed" && !status.includes("close")) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ev.name.toLowerCase().includes(query) ||
        ev.event_type.toLowerCase().includes(query) ||
        ev.organization?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const displayedEvents =
    filter === "registered"
      ? registeredEvents.filter((ev) => {
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              ev.name.toLowerCase().includes(query) ||
              ev.event_type.toLowerCase().includes(query) ||
              ev.organization?.toLowerCase().includes(query)
            );
          }
          return true;
        })
      : filteredEvents;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Discover Opportunities
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Participate in prestigious hackathons, coding competitions and
              innovation challenges
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Search events, organizations or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 py-6 text-base"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {selectedEvent ? (
          <Card className="max-w-3xl mx-auto shadow-lg border dark:border-gray-700 overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="text-white text-center p-4 z-10">
                <Avatar className="h-24 w-24 mx-auto bg-white p-1">
                  <AvatarImage
                    src={selectedEvent.logo}
                    alt={selectedEvent.organization}
                  />
                  <AvatarFallback>
                    {selectedEvent.organization?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <CardHeader className="pt-6 pb-3 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Badge
                  variant={getStatusColor(selectedEvent.status) as any}
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {getStatusIcon(selectedEvent.status)}
                  {selectedEvent.status}
                </Badge>
                {/* <span className="text-sm text-gray-500 dark:text-gray-400">
                  ID: #{selectedEvent.id}
                </span> */}
              </div>
              <CardTitle className="text-2xl font-bold mt-2">
                {selectedEvent.name}
              </CardTitle>
              <CardDescription className="text-sm mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>
                    Organized by{" "}
                    <span className="font-semibold">
                      {selectedEvent.organization}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {new Date(selectedEvent.start).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}{" "}
                    to{" "}
                    {new Date(selectedEvent.end).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
                <div className="flex flex-col gap-2 items-center justify-center p-3 border-r dark:border-gray-700">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs uppercase font-medium text-gray-500">
                    Team Size
                  </span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    {selectedEvent.team_size}
                  </span>
                </div>

                <div className="flex flex-col gap-2 items-center justify-center p-3 border-r dark:border-gray-700">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs uppercase font-medium text-gray-500">
                    Prizes Worth
                  </span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    {selectedEvent.prizes}
                  </span>
                </div>

                <div className="flex flex-col gap-2 items-center justify-center p-3">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs uppercase font-medium text-gray-500">
                    Duration
                  </span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    {Math.round(
                      (new Date(selectedEvent.end).getTime() -
                        new Date(selectedEvent.start).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>

              {selectedEvent.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    About This Event
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>Registration Status</span>
                </h3>
                <div className="space-y-2">
                  <Progress value={selectedEvent.registrations_filled} />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{selectedEvent.registrations_filled}% filled</span>
                    <span>Limited Slots</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4">
                  Registration Details
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name" className="text-sm font-medium">
                      Team Name *
                    </Label>
                    <Input
                      id="team-name"
                      placeholder="Enter your team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className={`w-full ${formErrors.teamName ? "border-red-500 dark:border-red-500" : ""}`}
                    />
                    {formErrors.teamName && (
                      <p className="text-xs text-red-500">
                        {formErrors.teamName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="team-members"
                      className="text-sm font-medium"
                    >
                      Team Members *{" "}
                      <span className="text-xs text-gray-500">
                        (comma-separated)
                      </span>
                    </Label>
                    <Input
                      id="team-members"
                      placeholder="Enter team members names"
                      value={teamMembers}
                      onChange={(e) => setTeamMembers(e.target.value)}
                      className={`w-full ${formErrors.teamMembers ? "border-red-500 dark:border-red-500" : ""}`}
                    />
                    {formErrors.teamMembers && (
                      <p className="text-xs text-red-500">
                        {formErrors.teamMembers}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-email" className="text-sm font-medium">
                      Contact Email *
                    </Label>
                    <Input
                      id="team-email"
                      type="email"
                      value={teamEmail}
                      disabled={teamEmail === undefined ? false : true}
                      className={`w-full ${formErrors.teamEmail ? "border-red-500 dark:border-red-500" : ""}`}
                    />
                    {formErrors.teamEmail && (
                      <p className="text-xs text-red-500">
                        {formErrors.teamEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="additional-info"
                      className="text-sm font-medium"
                    >
                      Additional Information{" "}
                      <span className="text-xs text-gray-500">(optional)</span>
                    </Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Tell us why you're interested in this event"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="w-full"
                      rows={3}
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-start gap-2">
                      <input
                        id="terms"
                        type="checkbox"
                        className="mt-1"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                      />
                      <div>
                        <Label htmlFor="terms" className="text-sm font-medium">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            terms and conditions
                          </a>{" "}
                          *
                        </Label>
                        {formErrors.acceptedTerms && (
                          <p className="text-xs text-red-500 mt-1">
                            {formErrors.acceptedTerms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
              <div className="flex gap-2">
                {selectedEvent && !selectedEvent.internal && (
                  <Button
                    onClick={handleVerifySubmission}
                    className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
                  >
                    Verify Submission
                  </Button>
                )}
                <Button
                  onClick={handleRegister}
                  disabled={
                    selectedEvent && !selectedEvent.internal && !canSubmit
                  }
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Submit Registration
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <Tabs
                defaultValue="all"
                onValueChange={(value) => setFilter(value)}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Events</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                  <TabsTrigger value="registered">Registered</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Sort by:</span>
                <select className="bg-transparent border rounded px-2 py-1 cursor-pointer">
                  <option>Latest</option>
                  <option>Oldest</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="shadow overflow-hidden">
                    <CardHeader className="p-0">
                      <Skeleton className="h-36 w-full rounded-none" />
                    </CardHeader>
                    <CardContent className="pt-6 pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : displayedEvents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedEvents.map((ev, idx) => (
                  <Card
                    key={`${ev.id}-${idx}`}
                    className="shadow-md hover:shadow-xl transition-shadow overflow-hidden border dark:border-gray-700 h-full flex flex-col"
                  >
                    <div className="h-36 bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant={getStatusColor(ev.status) as any}
                          className="font-medium flex items-center gap-1 px-2 py-1"
                        >
                          {getStatusIcon(ev.status)}
                          {ev.status}
                        </Badge>
                      </div>
                      <div className="text-white text-center p-4 z-10 flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2 bg-white p-1">
                          <AvatarImage src={ev.logo} alt={ev.organization} />
                          <AvatarFallback>
                            {ev.organization?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="uppercase text-xs tracking-wider font-semibold">
                          by {ev.organization}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    </div>

                    <CardHeader className="pt-4 pb-2 flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="outline"
                          className="font-normal text-xs"
                        >
                          {ev.event_type || "Hackathon"}
                        </Badge>
                        <span className="text-sm text-gray-500">#{ev.id}</span>
                      </div>
                      <CardTitle className="text-lg font-bold line-clamp-1">
                        {ev.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(ev.start).toLocaleDateString()}
                      </CardDescription>
                      <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>{ev.team_size} members</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Award className="h-4 w-4" />
                            <span>{ev.prizes}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              Registration
                            </span>
                            <span className="font-medium">
                              {ev.registrations_filled}% filled
                            </span>
                          </div>
                          <Progress
                            value={ev.registrations_filled}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardFooter className="pt-2 border-t dark:border-gray-700 mt-auto">
                      {filter === "registered" ? (
                        new Date(ev.start) <= new Date() ? (
                          <Button
                            onClick={() => setFeedbackEvent(ev)}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                          >
                            Feedback
                          </Button>
                        ) : (
                          <Button disabled className="w-full">
                            Already Registered
                          </Button>
                        )
                      ) : (
                        <Button
                          onClick={() => setSelectedEvent(ev)}
                          disabled={!ev.status.toLowerCase().includes("open")}
                          className={`w-full ${
                            ev.status.toLowerCase().includes("open")
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              : ""
                          }`}
                        >
                          {ev.status.toLowerCase().includes("open")
                            ? "Register Now"
                            : "Closed"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                  No events found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any events matching your criteria. Try
                  adjusting your filters or check back later for new
                  opportunities.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {feedbackEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Feedback for {feedbackEvent.name}
              </h3>
              <button
                onClick={() => setFeedbackEvent(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                X
              </button>
            </div>
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-2">
                Rating (1 to 5)
              </Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-2">
                Additional Feedback
              </Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setFeedbackEvent(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleFeedbackSubmit}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
