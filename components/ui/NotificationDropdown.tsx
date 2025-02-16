"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "FossHack 2025",
    date: "Feburary 22, 2025",
    description: "Join us for a weekend of innovation and fun.",
  },
  {
    id: 2,
    title: "CITIL SDG Hackathon",
    date: "February 17, 2025",
    description: "Test your coding skills and win prizes.",
  },
];

export default function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {notifications.length}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-900 rounded-lg p-2 shadow-lg"
      >
        <h3 className="px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
          Upcoming Hackathons
        </h3>
        <div className="max-h-60 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mb-1"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {notif.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {notif.date}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {notif.description}
              </p>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
