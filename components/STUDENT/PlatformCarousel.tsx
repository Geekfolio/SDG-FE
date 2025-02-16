import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LeetCodeProgressCircle from "@/components/ui/LeetCodeProgressCircle";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

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
    <div className="flex items-center space-x-4">
      <div className="p-4 rounded-lg bg-inherit">
        <div className="flex flex-col md:flex-row gap-6">
          <button
            onClick={prevPlatform}
            className="p-2 rounded-full text-white hover:bg-gray-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <h4 className="text-center text-lg font-semibold mb-2 text-white">
            {platform.name}
          </h4>
          <button
            onClick={nextPlatform}
            className="p-2 rounded-full text-white hover:bg-gray-700 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {platform.stats ? (
          <div className="flex flex-col items-center">
            <LeetCodeProgressCircle
              easy={platform.stats.easy.solved}
              medium={platform.stats.medium.solved}
              hard={platform.stats.hard.solved}
            />
            <p className="mt-2 text-sm text-gray-300">
              Rating: {platform.rating}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Progress value={platform.progress!} />
            <p className="mt-2 text-sm text-gray-300">
              Rating: {platform.rating}
            </p>
            {platform.stars && (
              <p className="flex flex-row">
                Stars: {platform.stars} <Star color="white" />
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformCarousel;
