"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, FileCheck, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { toast, ToastPosition } from "react-toastify";

interface GradingPanelProps {
    eventId: number;
    selectedParticipant: any;
    setSelectedParticipant: (participant: any) => void;
    userRole: string;
}

export default function GradingPanel({
  eventId,
  selectedParticipant,
  setSelectedParticipant,
  userRole,
}: GradingPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentCriteria, setCurrentCriteria] = useState<any[]>([
    {
      id: 1,
      name: "Technical Execution",
      description: "Quality of code and implementation",
      maxPoints: 25,
      score: 0,
    },
    {
      id: 2,
      name: "Innovation",
      description: "Uniqueness and creativity of solution",
      maxPoints: 20,
      score: 0,
    },
    {
      id: 3,
      name: "Design",
      description: "User interface, experience and visual design",
      maxPoints: 20,
      score: 0,
    },
    {
      id: 4,
      name: "Presentation",
      description: "Clarity of demo and explanation",
      maxPoints: 15,
      score: 0,
    },
    {
      id: 5,
      name: "Impact",
      description: "Potential real-world application and usefulness",
      maxPoints: 20,
      score: 0,
    },
  ]);
  const [feedback, setFeedback] = useState("");

  // Mock API call for participants with submissions
  useEffect(() => {
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
    setParticipants(mockParticipants.filter((p) => p.submissionStatus !== "Not Submitted"));
  }, [eventId]);

  const totalScore = currentCriteria.reduce((sum, criterion) => sum + criterion.score, 0);
  const totalPossible = currentCriteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0);

  const updateCriteriaScore = (id: number, score: number) => {
    setCurrentCriteria(
      currentCriteria.map((criterion) =>
        criterion.id === id
          ? { ...criterion, score: Math.min(criterion.maxPoints, Math.max(0, score)) }
          : criterion
      )
    );
  };

  const filteredParticipants = participants.filter((participant) =>
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
                          selectedParticipant?.id === participant.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
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
                              {new Date(participant.submissionDate).toLocaleDateString()}
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
                      score: totalScore,
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