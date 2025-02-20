import React from "react";
import { ActivitySquare } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-background/50 dark:bg-background/20 backdrop-blur-sm">
      {icon || <ActivitySquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />}
      <h3 className="text-xl font-medium mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2">{description}</p>
    </div>
  );
}