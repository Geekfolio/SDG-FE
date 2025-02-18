"use client";

import { TableCell } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, Trophy, Star, Code, Medal, BookOpen, Zap, Award, Rocket } from "lucide-react";

interface HackathonEntry {
  name: string;
  date: string;
  result: string;
}

interface StudentBadge {
  name: string;
  description: string;
  icon: React.ReactNode;
  level: "bronze" | "silver" | "gold" | "platinum";
  achievedDate: string;
}

// Mock function to fetch student data with additional gamification elements
const fetchStudentData = (id: string) => {
  const calculateLevel = (xp: number) => {
    if (xp < 1000) return "Novice";
    if (xp < 2500) return "Apprentice"; 
    if (xp < 5000) return "Intermediate";
    if (xp < 10000) return "Advanced";
    return "Expert";
  };
  
  const xp = 1000 + Math.floor(Math.random() * 9000);
  const level = calculateLevel(xp);
  const nextLevelXP = level === "Novice" ? 1000 : 
                      level === "Apprentice" ? 2500 : 
                      level === "Intermediate" ? 5000 :
                      level === "Advanced" ? 10000 : 20000;
  
  // Generate badges
  const badges: StudentBadge[] = [
    {
      name: "Algorithm Master",
      description: "Solved 100+ algorithm problems",
      icon: <Code className="h-6 w-6 text-blue-500" />,
      level: "gold",
      achievedDate: "2025-01-10"
    },
    {
      name: "Hackathon Champion",
      description: "Won 3 hackathons",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      level: "silver",
      achievedDate: "2025-02-22"
    },
    {
      name: "Web Wizard",
      description: "Built 10+ web applications",
      icon: <Rocket className="h-6 w-6 text-purple-500" />,
      level: "bronze",
      achievedDate: "2024-11-05"
    },
    {
      name: "Academic Star",
      description: "Achieved 90+ in all subjects",
      icon: <Star className="h-6 w-6 text-green-500" />,
      level: Math.random() > 0.5 ? "platinum" : "bronze",
      achievedDate: "2025-03-15"
    }
  ];
  
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
      { name: "HackA", date: "2025-01-15", result: "Winner", points: 250 },
      { name: "CodeFest", date: "2025-02-20", result: "Participant", points: 50 },
      { name: "TechChallenge", date: "2025-03-10", result: "Runner-up", points: 150 },
    ],
    academicPerformance: [
      { subject: "Data Structures", score: 85 },
      { subject: "Algorithms", score: 78 },
      { subject: "Web Development", score: 92 },
      { subject: "Machine Learning", score: 88 },
    ],
    // Gamification elements
    xp,
    level,
    nextLevelXP,
    rank: Math.floor(Math.random() * 500) + 1,
    problemsSolved: Math.floor(Math.random() * 300) + 50,
    streak: Math.floor(Math.random() * 30) + 1,
    badges,
    codingStats: {
      easy: { solved: Math.floor(Math.random() * 100), total: 100 },
      medium: { solved: Math.floor(Math.random() * 150), total: 200 },
      hard: { solved: Math.floor(Math.random() * 50), total: 100 },
    },
    recentActivities: [
      { action: "Solved", item: "Binary Tree Traversal", points: 50, date: "2025-03-20" },
      { action: "Completed", item: "JavaScript Challenge", points: 75, date: "2025-03-18" },
      { action: "Participated", item: "AI Hackathon", points: 100, date: "2025-03-15" },
      { action: "Earned Badge", item: "Algorithm Master", points: 200, date: "2025-03-10" },
    ]
  };
};

const getBadgeColor = (level: string) => {
  switch(level) {
    case "bronze": return "bg-amber-600";
    case "silver": return "bg-gray-400";
    case "gold": return "bg-yellow-500";
    case "platinum": return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
    default: return "bg-gray-300";
  }
};

export function StudentDetails({ id }: { id: string }) {
  const [student, setStudent] = useState<any>(null);
  const [currentXP, setCurrentXP] = useState(0);

  useEffect(() => {
    const data = fetchStudentData(id);
    setStudent(data);
    
    // Animate XP bar
    const totalXP = data.xp;
    const interval = setInterval(() => {
      setCurrentXP(prev => {
        if (prev >= totalXP) {
          clearInterval(interval);
          return totalXP;
        }
        return prev + Math.ceil(totalXP / 100);
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, [id]);

  if (!student) return <div>Loading...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const problemData = [
    { name: "Easy", value: student.codingStats.easy.solved, total: student.codingStats.easy.total },
    { name: "Medium", value: student.codingStats.medium.solved, total: student.codingStats.medium.total },
    { name: "Hard", value: student.codingStats.hard.solved, total: student.codingStats.hard.total },
  ];

  return (
    <div className="space-y-8">
      {/* Hero section with level and XP */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                {student.rollNumber} • {student.class}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold">{student.level}</div>
              <div className="text-blue-100">Rank #{student.rank}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>XP: {currentXP}/{student.nextLevelXP}</span>
              <span>{Math.floor((currentXP/student.nextLevelXP) * 100)}%</span>
            </div>
            <Progress value={(currentXP/student.nextLevelXP) * 100} className="h-2 bg-blue-300" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-600 rounded-lg p-3 flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="text-blue-100 text-xs">Hackathons Won</p>
                  <p className="text-xl font-bold">{student.hackathonsWon}</p>
                </div>
              </div>
              
              <div className="bg-blue-600 rounded-lg p-3 flex items-center space-x-3">
                <Code className="h-8 w-8 text-green-300" />
                <div>
                  <p className="text-blue-100 text-xs">Problems Solved</p>
                  <p className="text-xl font-bold">{student.problemsSolved}</p>
                </div>
              </div>
              
              <div className="bg-blue-600 rounded-lg p-3 flex items-center space-x-3">
                <Zap className="h-8 w-8 text-amber-300" />
                <div>
                  <p className="text-blue-100 text-xs">Current Streak</p>
                  <p className="text-xl font-bold">{student.streak} days</p>
                </div>
              </div>
              
              <div className="bg-blue-600 rounded-lg p-3 flex items-center space-x-3">
                <Award className="h-8 w-8 text-purple-300" />
                <div>
                  <p className="text-blue-100 text-xs">Badges Earned</p>
                  <p className="text-xl font-bold">{student.badges.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Badges & Status */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Medal className="mr-2 h-5 w-5 text-yellow-500" />
                Earned Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.badges.map((badge: StudentBadge, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${getBadgeColor(badge.level)}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{badge.name}</h4>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(badge.achievedDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.recentActivities.map((activity: any, index: number) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{activity.action} <span className="text-blue-600">{activity.item}</span></p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      +{activity.points} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="progress" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="coding">Skills</TabsTrigger>
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Coding Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-center">Problems Solved by Difficulty</h4>
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie
                            data={problemData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {problemData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} solved`, ""]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Easy</span>
                          <span className="text-sm text-gray-500">{student.codingStats.easy.solved}/{student.codingStats.easy.total}</span>
                        </div>
                        <Progress value={(student.codingStats.easy.solved/student.codingStats.easy.total) * 100} className="h-2 bg-gray-200 [&>div]:bg-green-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Medium</span>
                          <span className="text-sm text-gray-500">{student.codingStats.medium.solved}/{student.codingStats.medium.total}</span>
                        </div>
                        <Progress value={(student.codingStats.medium.solved/student.codingStats.medium.total) * 100} className="h-2 bg-gray-200 [&>div]:bg-yellow-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Hard</span>
                          <span className="text-sm text-gray-500">{student.codingStats.hard.solved}/{student.codingStats.hard.total}</span>
                        </div>
                        <Progress value={(student.codingStats.hard.solved/student.codingStats.hard.total) * 100} className="h-2 bg-gray-200 [&>div]:bg-red-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="coding">
              <Card>
                <CardHeader>
                  <CardTitle>Coding Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(student.codingSkills).map(
                        ([key, value]) => ({ 
                          name: key.charAt(0).toUpperCase() + key.slice(1), 
                          value,
                          fill: key === 'python' ? '#3776AB' : 
                                key === 'javascript' ? '#F7DF1E' :
                                key === 'java' ? '#007396' : '#239120'
                        }),
                      )}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Proficiency" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hackathons">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Hackathon History
                  </CardTitle>
                  <CardDescription>
                    Participated in {student.hackathonsParticipated} hackathons and won {student.hackathonsWon}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.hackathonHistory.map(
                        (hackathon: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{hackathon.name}</TableCell>
                            <TableCell>{hackathon.date}</TableCell>
                            <TableCell>
                              <Badge variant={
                                hackathon.result === "Winner" ? "default" :
                                hackathon.result === "Runner-up" ? "secondary" :
                                "outline"
                              }>
                                {hackathon.result}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {hackathon.points} XP
                            </TableCell>
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
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={student.academicPerformance}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="score" 
                        name="Score" 
                        radius={[4, 4, 0, 0]}
                        fill="#82ca9d"
                        background={{ fill: '#eee' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-4">Performance Analysis</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CircleCheck className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Strengths:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7 mb-4">
                        Excellent in Web Development. Consistently scores above 90% in practical assignments.
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Code className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Areas for Growth:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">
                        Could improve algorithm optimization skills. Recommended to practice more medium and hard-level algorithm problems.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}