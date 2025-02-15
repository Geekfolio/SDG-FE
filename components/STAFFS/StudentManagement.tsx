"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for students
const studentsData = Array.from({ length: 180 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  rollNumber: `R${String(i + 1).padStart(3, "0")}`,
  class: `Class ${["A", "B", "C"][Math.floor(i / 60)]}`,
  status: ["In Class", "On Duty", "Hackathon"][Math.floor(Math.random() * 3)],
  hackathonsParticipated: Math.floor(Math.random() * 10),
  hackathonsWon: Math.floor(Math.random() * 3),
}))

export default function () {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("All")

  const filteredStudents = studentsData.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedClass === "All" || student.class === selectedClass),
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search by name or roll number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Classes</SelectItem>
            <SelectItem value="Class A">Class A</SelectItem>
            <SelectItem value="Class B">Class B</SelectItem>
            <SelectItem value="Class C">Class C</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Roll Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hackathons Participated</TableHead>
            <TableHead>Hackathons Won</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Link href={`/student/${student.id}`} className="text-blue-500 hover:underline">
                  {student.rollNumber}
                </Link>
              </TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.status}</TableCell>
              <TableCell>{student.hackathonsParticipated}</TableCell>
              <TableCell>{student.hackathonsWon}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

