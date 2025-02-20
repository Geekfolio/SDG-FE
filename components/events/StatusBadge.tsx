"use client";
import React from "react";

interface StatusBadgeProps {
  status: string;
  type?: "tag";
}

const statusColors: Record<string, string> = {
  "In Progress": "bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 border-blue-500/30",
  Upcoming: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400 border-amber-500/30",
  "Registration Open": "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border-emerald-500/30",
  Completed: "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400 border-slate-500/30",
  Open: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/25 dark:text-purple-400 border-purple-500/30",
  Closed: "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400 border-red-500/30",
};

const tagColors = "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600";

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const classes =
    type === "tag"
      ? `${tagColors} rounded px-2 py-0.5 text-xs`
      : `${statusColors[status] || "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"} rounded px-2 py-0.5 text-xs`;
  
  return <span className={classes}>{status}</span>;
}