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
  Calendar,
  Users,
  Award,
  Code,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Legend, 
  Tooltip,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeetCodeProgressCircle from "@/components/ui/LeetCodeProgressCircle";
import PlatformCarousel from "@/components/STUDENT/PlatformCarousel";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate coding stats
  const totalSolved = platforms.reduce((acc, platform) => {
    if (platform.name === "LeetCode" && platform.stats) {
      return acc + 
        platform.stats.easy.solved + 
        platform.stats.medium.solved + 
        platform.stats.hard.solved;
    }
    return acc;
  }, 0);
  
  const totalHackathons = hackathonData.reduce((acc, item) => acc + item.participated, 0);
  const totalWins = hackathonData.reduce((acc, item) => acc + item.won, 0);

  // Calculate chart colors based on theme
  const getBarColors = () => {
    return isDark 
      ? { participated: '#a78bfa', won: '#6ee7b7' }  // Light purple and green for dark mode
      : { participated: '#8b5cf6', won: '#10b981' }; // Darker for light mode
  };
  
  const barColors = getBarColors();

  // Profile component
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-6">
        {/* Hero Section with Profile Card */}
        <Card className="overflow-hidden border-0 shadow-md dark:bg-gray-900/50">
          <div className="h-32 bg-gradient-to-r from-violet-500 to-indigo-500 dark:from-violet-600 dark:to-indigo-700"></div>
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Avatar, name, and social buttons */}
              <div className="flex flex-col items-center space-y-4 md:w-1/4">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg dark:border-gray-800">
                  <AvatarImage src={session?.user.image!} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-violet-200 to-indigo-200 dark:from-violet-900/60 dark:to-indigo-900/60 text-violet-700 dark:text-violet-300">
                    {(session?.user.name || "Shreehari S").split(' ').map(part => part[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mt-2">
                    {session?.user.name || "Shreehari S"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {session?.user.department || "CSE"}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors dark:border-gray-700">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors dark:border-gray-700">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors dark:border-gray-700">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors dark:border-gray-700">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Middle Column: Stats and Contact Details */}
              <div className="flex flex-col space-y-4 md:w-2/4 md:pl-6 md:border-l dark:border-gray-700">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card className="bg-violet-50 dark:bg-violet-900/10 border-0 dark:border dark:border-violet-900/20">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Problems Solved</p>
                        <h3 className="text-2xl font-bold">{totalSolved}</h3>
                      </div>
                      <Code className="h-8 w-8 text-violet-500 dark:text-violet-400" />
                    </CardContent>
                  </Card>
                  <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-0 dark:border dark:border-emerald-900/20">
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hackathon Wins</p>
                        <h3 className="text-2xl font-bold">{totalWins}/{totalHackathons}</h3>
                      </div>
                      <Trophy className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                    </CardContent>
                  </Card>
                </div>
                
                {/* Contact Details */}
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">
                      {session?.user.email || "shreeharis.aiml2023@citchennai.net"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm">Chennai</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                      <School className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm">CIT</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Coding Platform Carousel */}
              <div className="md:w-1/4 md:border-l pl-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Coding Platforms</h3>
                <PlatformCarousel />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Hackathons and Stats */}
        <Tabs defaultValue="hackathons" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6 dark:bg-gray-800/50">
            <TabsTrigger value="hackathons" className="w-1/2 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900 dark:data-[state=active]:bg-violet-900/20 dark:data-[state=active]:text-violet-300">Hackathons</TabsTrigger>
            <TabsTrigger value="stats" className="w-1/2 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-900 dark:data-[state=active]:bg-violet-900/20 dark:data-[state=active]:text-violet-300">Performance</TabsTrigger>
          </TabsList>
          
          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="space-y-6">
            {/* Hackathon Analytics Card */}
            <Card className="dark:bg-gray-900/50 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                  Hackathon Participation
                </CardTitle>
                <CardDescription>
                  Track of hackathons participated and won over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={hackathonData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: isDark ? '0 4px 14px 0 rgba(0,0,0,0.2)' : '0 4px 14px 0 rgba(0,0,0,0.1)',
                        color: isDark ? '#e2e8f0' : 'inherit'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '10px',
                        color: isDark ? '#e2e8f0' : 'inherit'
                      }} 
                    />
                    <Bar 
                      dataKey="participated" 
                      name="Participated" 
                      radius={[4, 4, 0, 0]}
                    >
                      {hackathonData.map((entry, index) => (
                        <Cell key={`participated-${index}`} fill={barColors.participated} />
                      ))}
                    </Bar>
                    <Bar 
                      dataKey="won" 
                      name="Won" 
                      radius={[4, 4, 0, 0]}
                    >
                      {hackathonData.map((entry, index) => (
                        <Cell key={`won-${index}`} fill={barColors.won} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground border-t pt-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total participation: {totalHackathons} hackathons
                </div>
              </CardFooter>
            </Card>

            {/* Recent Hackathons Grid */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                Recent Hackathons
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hackathons.map((hackathon) => (
                  <Card key={hackathon.name} className="group hover:shadow-md transition-shadow dark:bg-gray-900/50 dark:border-gray-800 dark:hover:border-violet-900/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                          {hackathon.name}
                        </CardTitle>
                        {hackathon.position === "Winner" && (
                          <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                        )}
                        {hackathon.position === "Runner Up" && (
                          <Award className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {hackathon.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {hackathon.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tech.map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="secondary"
                            className="bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/40"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-muted-foreground border-t mt-4 dark:border-gray-800">
                      <span className="font-medium">
                        {hackathon.position}
                      </span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-2">
              {/* LeetCode Stats Card */}
              <Card className="dark:bg-gray-900/50 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    LeetCode Statistics
                  </CardTitle>
                  <CardDescription>
                    Problem solving progress across different difficulty levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Easy Problems */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Easy</span>
                        <span className="text-sm text-muted-foreground">
                          {platforms[0]?.stats?.easy?.solved ?? 0}/{platforms[0]?.stats?.easy?.total ?? 0}
                        </span>
                      </div>
                      <Progress 
                        value={platforms[0]?.stats?.easy ? (platforms[0].stats.easy.solved / platforms[0].stats.easy.total) * 100 : 0} 
                        className="h-2 bg-green-100 dark:bg-green-900/30"
                      >
                        <div className="h-full bg-green-500 dark:bg-green-500/70"></div>
                      </Progress>
                    </div>
                    
                    {/* Medium Problems */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Medium</span>
                        <span className="text-sm text-muted-foreground">
                          {platforms[0]?.stats?.medium?.solved ?? 0}/{platforms[0]?.stats?.medium?.total ?? 0}
                        </span>
                      </div>
                      <Progress 
                        value={platforms[0]?.stats?.medium ? (platforms[0].stats.medium.solved / platforms[0].stats.medium.total) * 100 : 0} 
                        className="h-2 bg-orange-100 dark:bg-orange-900/30"
                      >
                        <div className="h-full bg-orange-500 dark:bg-orange-500/70"></div>
                      </Progress>
                    </div>
                    
                    {/* Hard Problems */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Hard</span>
                        <span className="text-sm text-muted-foreground">
                          {platforms[0]?.stats?.hard?.solved ?? 0}/{platforms[0]?.stats?.hard?.total ?? 0}
                        </span>
                      </div>
                      <Progress 
                        value={platforms[0]?.stats?.hard ? (platforms[0].stats.hard.solved / platforms[0].stats.hard.total) * 100 : 0} 
                        className="h-2 bg-red-100 dark:bg-red-900/30"
                      >
                        <div className="h-full bg-red-500 dark:bg-red-500/70"></div>
                      </Progress>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4 text-sm dark:border-gray-800">
                  <span>Current Rank: <span className="font-bold">{platforms[0].rank}</span></span>
                  <Button variant="link" className="px-0 text-violet-600 dark:text-violet-400">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Other Platforms Card */}
              <Card className="dark:bg-gray-900/50 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    Other Coding Platforms
                  </CardTitle>
                  <CardDescription>
                    Performance across different competitive coding platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 pt-4">
                    {/* CodeChef */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">CodeChef</h4>
                        <p className="text-xs text-muted-foreground">Current Rating: <span className="font-bold">1945</span></p>
                      </div>
                      <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        {platforms[1].rank}
                      </Badge>
                    </div>
                    
                    {/* CodeForces */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">CodeForces</h4>
                        <p className="text-xs text-muted-foreground">Global Percentile: <span className="font-bold">Top 15%</span></p>
                      </div>
                      <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300">
                        {platforms[2].rank}
                      </Badge>
                    </div>
                    
                    {/* HackerRank */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">HackerRank</h4>
                        <p className="text-xs text-muted-foreground">Problem Solving: <span className="font-bold">5 ★</span></p>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Expert
                      </Badge>
                    </div>
                    
                    {/* Atcoder */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Atcoder</h4>
                        <p className="text-xs text-muted-foreground">Current Rating: <span className="font-bold">1256</span></p>
                      </div>
                      <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        Green
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 dark:border-gray-800">
                  <Button variant="outline" className="w-full dark:border-gray-700 dark:hover:bg-gray-800">
                    View All Platforms
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}