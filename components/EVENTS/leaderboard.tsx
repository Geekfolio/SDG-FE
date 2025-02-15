import { Trophy, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const mockLeaderboard = [
  {
    team: "Quantum Coders",
    score: 950,
    completed: 5,
    tasks: [
      { name: "AI Challenge", status: "completed" },
      { name: "Blockchain Task", status: "completed" },
      { name: "UI Design", status: "pending" },
    ],
  },
  {
    team: "Byte Force",
    score: 870,
    completed: 4,
    tasks: [
      { name: "AI Challenge", status: "completed" },
      { name: "Blockchain Task", status: "completed" },
      { name: "UI Design", status: "in-progress" },
    ],
  },
  {
    team: "Code Phoenix",
    score: 790,
    completed: 3,
    tasks: [
      { name: "AI Challenge", status: "completed" },
      { name: "Blockchain Task", status: "pending" },
      { name: "UI Design", status: "pending" },
    ],
  },
];

export function Leaderboard({ eventId }: { eventId: number }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between overflow-x-hidden">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Hackathon Leaderboard
          </CardTitle>
          <Button variant="ghost" className="gap-1">
            Sort by <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="pr-4">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaderboard.map((entry, index) => (
              <TableRow key={entry.team}>
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell className="font-semibold">{entry.team}</TableCell>
                <TableCell>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {entry.score}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex items-center gap-1",
                        entry.completed >= 4
                          ? "text-emerald-600"
                          : "text-amber-600",
                      )}
                    >
                      {entry.completed}/5
                    </span>
                    <Progress
                      value={(entry.completed / 5) * 100}
                      className="w-24"
                    />
                  </div>
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex gap-2 justify-end">
                    {entry.tasks.map((task) =>
                      task.status === "completed" ? (
                        <CheckCircle
                          key={`${entry.team}-${task.name}`}
                          className="h-5 w-5 text-emerald-500"
                        />
                      ) : task.status === "in-progress" ? (
                        <div
                          key={`${entry.team}-${task.name}`}
                          className="relative"
                        >
                          <XCircle className="h-5 w-5 text-amber-500" />
                          <div className="absolute top-0 left-0 w-full h-full border-2 border-amber-500 animate-ping rounded-full" />
                        </div>
                      ) : (
                        <XCircle
                          key={`${entry.team}-${task.name}`}
                          className="h-5 w-5 text-gray-300"
                        />
                      ),
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
