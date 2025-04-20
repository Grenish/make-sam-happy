"use client";

import { useEffect, useState } from "react";
import { Award, Flame } from "lucide-react";

interface ScoreTrackerProps {
  score: number;
  highScore: number;
  streak: number;
}

export default function ScoreTracker({ score, highScore, streak }: ScoreTrackerProps) {
  const [isScoreIncreasing, setIsScoreIncreasing] = useState(false);
  const [prevScore, setPrevScore] = useState(score);
  
  // Animation effect when score changes
  useEffect(() => {
    if (score > prevScore) {
      setIsScoreIncreasing(true);
      const timer = setTimeout(() => {
        setIsScoreIncreasing(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
    setPrevScore(score);
  }, [score, prevScore]);
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Award size={16} className="text-blue-400 mr-1.5" />
        <span className={`font-bold text-lg sm:text-xl ${
          isScoreIncreasing 
            ? 'text-blue-400 scale-105' 
            : 'text-white'
        } transition-all duration-300`}>
          {score}
        </span>
      </div>
      
      <div className="flex items-center text-xs text-slate-400 mt-1">
        <span>Best: </span>
        <span className="text-slate-300 ml-1 font-medium">{highScore}</span>
      </div>
      
      {streak > 0 && (
        <div className="mt-2 bg-slate-800/80 rounded-sm px-2 py-1 border border-slate-700/40 inline-flex items-center">
          <Flame size={12} className="text-amber-400 mr-1" />
          <span className="text-xs">
            Streak: <span className="text-amber-300 font-bold">{streak}</span>
          </span>
        </div>
      )}
    </div>
  );
}
