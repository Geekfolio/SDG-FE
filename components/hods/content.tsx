"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Search, X, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ODProofModal } from "@/components/hods/od-modal";

// Mock data for demonstration
const mockRequests = [
  {
    id: 1,
    studentName: "Shreehari S",
    studentId: "ST001",
    department: "Computer Science",
    reason: "Attending a conference",
    fromDate: "2025-02-25",
    toDate: "2025-02-27",
    status: "Pending",
    email: "john.doe@example.com",
    year: "3rd Year",
    cgpa: "3.8",
    proofImage: "/placeholder.svg?height=600&width=400",
  },
  {
    id: 2,
    studentName: "Shalini",
    studentId: "ST002",
    department: "Electrical Engineering",
    reason: "Participating in a hackathon",
    fromDate: "2025-02-28",
    toDate: "2025-03-01",
    status: "Pending",
    email: "jane.smith@example.com",
    year: "2nd Year",
    cgpa: "3.9",
    proofImage: "/placeholder.svg?height=600&width=400",
  },
  // Add more mock data as needed
];

export function ODRequestsTable() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const handleAccept = (id: number) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "Accepted" } : request,
      ),
    );
  };

  const handleReject = (id: number) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "Rejected" } : request,
      ),
    );
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search by name, ID, or department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>From Date</TableHead>
              <TableHead>To Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/student/${request.studentId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {request.studentName}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p>
                            <strong>Email:</strong> {request.email}
                          </p>
                          <p>
                            <strong>Year:</strong> {request.year}
                          </p>
                          <p>
                            <strong>CGPA:</strong> {request.cgpa}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{request.studentId}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{request.fromDate}</TableCell>
                <TableCell>{request.toDate}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedProof(request.proofImage)}
                  >
                    <FileText className="h-4 w-4 mr-1" /> Show Proof
                  </Button>
                </TableCell>
                <TableCell>
                  {request.status === "Pending" && (
                    <div className="flex space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Accept OD Request
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to accept the OD request for{" "}
                              {request.studentName}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAccept(request.id)}
                            >
                              Accept
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reject OD Request
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject the OD request for{" "}
                              {request.studentName}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleReject(request.id)}
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ODProofModal
        isOpen={!!selectedProof}
        onClose={() => setSelectedProof(null)}
        imageUrl={"/oddletter.jpeg"}
      />
    </div>
  );
}
