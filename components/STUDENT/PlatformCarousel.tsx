import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import LeetCodeProgressCircle from "@/components/ui/LeetCodeProgressCircle";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Platform {
  name: string;
  stats?: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  stars?: number;
  progress?: number;
  rating: string;
}

const platforms: Platform[] = [
  {
    name: "LeetCode",
    stats: {
      easy: { solved: 180, total: 857 },
      medium: { solved: 243, total: 1795 },
      hard: { solved: 35, total: 799 },
    },
    rating: "458/3451",
  },
  {
    name: "CodeChef",
    stars: 5,
    rating: "1635",
  },
  {
    name: "CodeForces",
    progress: 1054 / 4000,
    rating: "1054",
  },
];

const PlatformCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPlatform = () => {
    setCurrentIndex((prev) => (prev - 1 + platforms.length) % platforms.length);
  };

  const nextPlatform = () => {
    setCurrentIndex((prev) => (prev + 1) % platforms.length);
  };

  const platform = platforms[currentIndex];

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border shadow-md dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="bg-gray-50 dark:bg-gray-900 pt-4 pb-3 px-5">
        <div className="flex items-center justify-between">
          <Button
            onClick={prevPlatform}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Previous platform"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>

          <CardTitle className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
            {platform.name}
            <Badge
              variant="outline"
              className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              {platform.rating}
            </Badge>
          </CardTitle>

          <Button
            onClick={nextPlatform}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Next platform"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-6 px-6">
        {platform.stats ? (
          <div className="flex flex-row items-center space-y-4">
            <LeetCodeProgressCircle
              easy={platform.stats.easy.solved}
              medium={platform.stats.medium.solved}
              hard={platform.stats.hard.solved}
            />
            <div className="grid grid-rows-3 gap-4 w-full mt-4 text-sm">
              <div className="flex flex-col items-center p-2 rounded-md bg-green-50 dark:bg-green-900/20">
                <span className="font-medium text-green-600 dark:text-green-400">
                  Easy
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {platform.stats.easy.solved}/{platform.stats.easy.total}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  Medium
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {platform.stats.medium.solved}/{platform.stats.medium.total}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-md bg-red-50 dark:bg-red-900/20">
                <span className="font-medium text-red-600 dark:text-red-400">
                  Hard
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {platform.stats.hard.solved}/{platform.stats.hard.total}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-5">
            {platform.stars && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={
                      i < platform.stars!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>
            )}

            {platform.progress && (
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Current: {Math.round(platform.progress * 4000)}</span>
                  <span>Goal: 4000</span>
                </div>
                <Progress
                  value={platform.progress * 100}
                  className="h-3 bg-gray-200 dark:bg-gray-700"
                />
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1">
                  {Math.round(platform.progress * 100)}% to goal
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformCarousel;
