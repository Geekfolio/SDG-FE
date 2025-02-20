"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Event {
  id: number;
  name: string;
  email: string;
  description: string;
  event_type: string;
  team_size: number;
  start: string;
  end: string;
  participants: number;
  status: string;
  authority: number;
  organization?: string;
  logo?: string;
  prizes?: string;
  registrations_filled?: number;
  internal: boolean;
  link?: string;
}

interface PopupEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onRegister: () => void; // <-- new prop
}

export default function PopupEventModal({
  isOpen,
  onClose,
  event,
  onRegister,
}: PopupEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Event header with logo and organization info */}
          <div className="flex items-center mb-4">
            {event.logo && (
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage
                  src={event.logo}
                  alt={event.organization || event.name}
                />
                <AvatarFallback>
                  {(event.organization || event.name).slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="text-sm font-medium">
                {event.organization || "Unknown Organization"}
              </p>
              <p className="text-xs text-gray-500">{event.event_type}</p>
            </div>
          </div>

          {/* Detailed event description */}
          <CardDescription>{event.description}</CardDescription>

          {/* Event details grid */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Team Size</p>
              <p>{event.team_size}</p>
            </div>
            <div>
              <p className="font-medium">Prizes</p>
              <p>{event.prizes}</p>
            </div>
            <div>
              <p className="font-medium">Participants</p>
              <p>{event.participants}</p>
            </div>
            <div>
              <p className="font-medium">Registrations</p>
              <p>{event.registrations_filled}%</p>
            </div>
            <div>
              <p className="font-medium">Event Dates</p>
              <p>
                {new Date(event.start).toLocaleDateString()} –{" "}
                {new Date(event.end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p>{event.status}</p>
            </div>
          </div>

          {/* Optional link */}
          {event.link && (
            <div className="mt-4">
              <p className="text-sm font-medium">Event Link:</p>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {event.link}
              </a>
            </div>
          )}

          {/* Contact Email */}
          <div className="mt-4">
            <p className="text-sm font-medium">Contact Email:</p>
            <p>{event.email}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={onRegister}>Register Now</Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
