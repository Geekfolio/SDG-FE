"use client";

import { TableCell } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface HackathonEntry {
  name: string;
  date: string;
  result: string;
}
// Mock function to fetch student data
const fetchStudentData = (id: string) => {
  // In a real application, this would be an API call
  return {
    id,
    name: `Student ${id}`,
    rollNumber: `R${id.padStart(3, "0")}`,
    class: `Class ${["A", "B", "C"][Math.floor(Number.parseInt(id) / 60)]}`,
    status: ["In Class", "On Duty", "Hackathon"][Math.floor(Math.random() * 3)],
    hackathonsParticipated: Math.floor(Math.random() * 10),
    hackathonsWon: Math.floor(Math.random() * 3),
    codingSkills: {
      python: Math.floor(Math.random() * 100),
      javascript: Math.floor(Math.random() * 100),
      java: Math.floor(Math.random() * 100),
      csharp: Math.floor(Math.random() * 100),
    },
    hackathonHistory: [
      { name: "HackA", date: "2025-01-15", result: "Winner" },
      { name: "CodeFest", date: "2025-02-20", result: "Participant" },
      { name: "TechChallenge", date: "2025-03-10", result: "Runner-up" },
    ],
    academicPerformance: [
      { subject: "Data Structures", score: 85 },
      { subject: "Algorithms", score: 78 },
      { subject: "Web Development", score: 92 },
      { subject: "Machine Learning", score: 88 },
    ],
  };
};

export function StudentDetails({ id }: { id: string }) {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    setStudent(fetchStudentData(id));
  }, [id]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{student.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Roll Number
              </p>
              <p className="text-2xl font-bold">{student.rollNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Class</p>
              <p className="text-2xl font-bold">{student.class}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                variant={
                  student.status === "In Class" ? "default" : "secondary"
                }
              >
                {student.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Hackathons
              </p>
              <p className="text-2xl font-bold">
                {student.hackathonsWon} / {student.hackathonsParticipated}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="coding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coding">Coding Skills</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathon History</TabsTrigger>
          <TabsTrigger value="academic">Academic Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="coding">
          <Card>
            <CardHeader>
              <CardTitle>Coding Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(student.codingSkills).map(
                    ([key, value]) => ({ name: key, value }),
                  )}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hackathons">
          <Card>
            <CardHeader>
              <CardTitle>Hackathon History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.hackathonHistory.map(
                    (hackathon: HackathonEntry, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{hackathon.name}</TableCell>
                        <TableCell>{hackathon.date}</TableCell>
                        <TableCell>{hackathon.result}</TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={student.academicPerformance}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Bar dataKey="score" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
