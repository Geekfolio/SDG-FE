"use client";

import {
  Trophy,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  School,
  Twitter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import LeetCodeProgressCircle from "@/components/ui/LeetCodeProgressCircle";
import PlatformCarousel from "@/components/STUDENT/PlatformCarousel";
import { useSession } from "next-auth/react";

const platforms = [
  {
    name: "LeetCode",
    stats: {
      easy: { solved: 180, total: 857 },
      medium: { solved: 243, total: 1795 },
      hard: { solved: 35, total: 799 },
    },
    rank: "458/3451",
  },
  { name: "CodeChef", progress: 0, rank: "SDE" },
  { name: "CodeForces", progress: 0, rank: "79" },
];

const hackathonData = [
  { month: "Jan", participated: 4, won: 1 },
  { month: "Feb", participated: 3, won: 2 },
  { month: "Mar", participated: 5, won: 2 },
  { month: "Apr", participated: 2, won: 1 },
  { month: "May", participated: 3, won: 0 },
  { month: "Jun", participated: 4, won: 2 },
];

const hackathons = [
  {
    name: "Smart India Hackathon 2023",
    date: "August 15-16, 2023",
    position: "Winner",
    description:
      "Built an AI-powered solution for agricultural yield prediction",
    tech: ["Python", "TensorFlow", "React", "Node.js"],
  },
  {
    name: "HackCIT 2023",
    date: "June 1-2, 2023",
    position: "Runner Up",
    description: "Developed a blockchain-based supply chain tracking system",
    tech: ["Solidity", "Web3.js", "Next.js", "MongoDB"],
  },
  {
    name: "Code For Good",
    date: "March 10-11, 2023",
    position: "Participant",
    description: "Created a platform for connecting NGOs with volunteers",
    tech: ["React", "Firebase", "Material UI", "Express"],
  },
];

export default function () {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column: Avatar, name, and social buttons */}
            <div className="flex flex-col items-center space-y-4 md:w-1/3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session?.user.image!} />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {session?.user.name || "Shreehari S"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {session?.user.department || "CSE"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Middle Column: Contact Details */}
            <div className="flex flex-col space-y-2 md:w-1/3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">
                  {session?.user.email || "shreeharis.aiml2023@citchennai.net"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Chennai</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="h-4 w-4" />
                <span className="text-sm">CIT</span>
              </div>
            </div>

            {/* Right Column: PlatformCarousel */}
            <div className="flex items-center justify-center md:w-1/3">
              <PlatformCarousel />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hackathon Participation</CardTitle>
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

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Hackathons</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((hackathon) => (
            <Card key={hackathon.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{hackathon.name}</CardTitle>
                  {hackathon.position === "Winner" && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <CardDescription>{hackathon.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {hackathon.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {hackathon.tech.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
