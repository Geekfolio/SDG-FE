import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Trophy, Tag, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { toast, ToastPosition } from "react-toastify";

const USER_ROLE = {
    STUDENT: "student",
    STAFF: "staff",
}

interface LiveEventCardProps {
  event: any;
  setSelectedEventId: (id: number) => void;
  setActiveView: (view: "leaderboard" | "participants" | null) => void;
  userRole: string;
  onDeleteEvent?: (id: number) => void;
}

export default function LiveEventCard({ event, setSelectedEventId, setActiveView, userRole, onDeleteEvent }: LiveEventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const formattedStartDate = startDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const formattedEndDate = endDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const durationText = durationInDays === 1 ? "1 day" : `${durationInDays} days`;

  const canViewLeaderboard = ["In Progress", "Completed", "Closed"].includes(event.status);

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all duration-200">
      <div className="relative overflow-hidden">
        <img src={event.image} alt={event.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-4 right-4">
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
          <h3 className="text-lg font-semibold text-white line-clamp-1">{event.name}</h3>
          <div className="flex items-center gap-1 text-xs text-white/80">
            <Calendar className="h-3 w-3" />
            <span>{formattedStartDate} to {formattedEndDate}</span>
          </div>
        </div>
      </div>
      <CardContent className="flex-grow py-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span>Duration: {durationText}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="text-muted-foreground h-4 w-4" />
            <span>{event.participants || 0} Participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="text-muted-foreground h-4 w-4" />
            <div className="flex flex-wrap gap-1">
              {event.tags?.map((tag: string, idx: number) => (
                <StatusBadge key={`${tag}-${idx}`} status={tag} type="tag" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className="my-2" />
      <CardFooter className="pt-2 pb-4 flex flex-col gap-3">
        {canViewLeaderboard ? (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => {
                setSelectedEventId(event.id);
                setActiveView("leaderboard");
              }}
            >
              <Trophy className="mr-2 h-4 w-4" /> Leaderboard
            </Button>
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => {
                setSelectedEventId(event.id);
                setActiveView("participants");
              }}
            >
              <Users className="mr-2 h-4 w-4" /> Participants
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedEventId(event.id);
              setActiveView("participants");
            }}
          >
            <Users className="mr-2 h-4 w-4" /> View Participants
          </Button>
        )}
        {userRole === USER_ROLE.STAFF && (
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="default"
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => {
                setSelectedEventId(event.id);
                setActiveView("participants");
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Manage Event
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toast.info("Edit functionality coming soon!", { position: "top-right" as ToastPosition })}
              >
                {/* Replace with pencil icon if preferred */}
                Edit
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (onDeleteEvent) {
                    onDeleteEvent(event.id);
                  } else {
                    toast.info("Delete functionality coming soon!", { position: "top-right" as ToastPosition });
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}