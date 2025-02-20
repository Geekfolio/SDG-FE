import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, ExternalLink, FileCheck, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, ToastPosition } from "react-toastify";

interface ParticipantsListProps {
  eventId: number;
  status: string;
  userRole: string;
  onGrade: (participant: any) => void;
}

export default function ParticipantsList({ eventId, status, userRole, onGrade }: ParticipantsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState("all");

  useEffect(() => {
    // Simulate API call
    const mockParticipants = Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`,
      team: Math.random() > 0.3 ? `Team ${Math.ceil(Math.random() * 10)}` : null,
      submissionStatus: Math.random() > 0.25 ? (Math.random() > 0.5 ? "Submitted" : "Graded") : "Not Submitted",
      submissionDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
      score: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : null,
      department: ["CS", "Engineering", "Design", "Business"][Math.floor(Math.random() * 4)],
      avatar: `/api/placeholder/32/32`,
    }));
    setParticipants(mockParticipants);
  }, [eventId]);

  const filteredParticipants = participants.filter((participant) => {
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-medium">Event Participants</h3>
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
          <Select value={filterValue} onValueChange={setFilterValue}>
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
              {userRole === "staff" && <TableHead className="text-right">Actions</TableHead>}
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
                    <Badge>
                      {participant.submissionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {participant.score !== null ? participant.score : "—"}
                  </TableCell>
                  {userRole === "staff" && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {participant.submissionStatus !== "Not Submitted" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onGrade(participant)}
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                            {participant.submissionStatus === "Graded" ? "Edit Grade" : "Grade"}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={userRole === "staff" ? 7 : 6} className="h-24 text-center">
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