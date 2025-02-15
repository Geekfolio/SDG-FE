"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const classData = [
  { name: "Class A", students: 60, onDuty: 5, hackathonsParticipated: 120, hackathonsWon: 15 },
  { name: "Class B", students: 58, onDuty: 3, hackathonsParticipated: 95, hackathonsWon: 10 },
  { name: "Class C", students: 62, onDuty: 7, hackathonsParticipated: 150, hackathonsWon: 20 },
]

const hackathonData = [
  { month: "Jan", participated: 25, won: 3 },
  { month: "Feb", participated: 30, won: 4 },
  { month: "Mar", participated: 35, won: 5 },
  { month: "Apr", participated: 40, won: 6 },
  { month: "May", participated: 45, won: 7 },
  { month: "Jun", participated: 50, won: 8 },
]

export default function() {
  const [selectedClass, setSelectedClass] = useState("Class A")

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.reduce((acc, c) => acc + c.students, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students on Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.reduce((acc, c) => acc + c.onDuty, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hackathons Participated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.reduce((acc, c) => acc + c.hackathonsParticipated, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hackathons Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.reduce((acc, c) => acc + c.hackathonsWon, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hackathon Participation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hackathonData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="participated" fill="#8884d8" name="Participated" />
              <Bar dataKey="won" fill="#82ca9d" name="Won" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="Class A" className="space-y-4">
        <TabsList>
          {classData.map((c) => (
            <TabsTrigger key={c.name} value={c.name} onClick={() => setSelectedClass(c.name)}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {classData.map((c) => (
          <TabsContent key={c.name} value={c.name}>
            <Card>
              <CardHeader>
                <CardTitle>{c.name} Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{c.students}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">On Duty</p>
                    <p className="text-2xl font-bold">{c.onDuty}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Hackathons Participated</p>
                    <p className="text-2xl font-bold">{c.hackathonsParticipated}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Hackathons Won</p>
                    <p className="text-2xl font-bold">{c.hackathonsWon}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
