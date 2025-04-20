"use client";

import { useState, useEffect } from "react";
import { Clock, Award } from "lucide-react";

export const Timer = ({ isRunning }: { isRunning: boolean }) => {
  const [time, setTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");
  
  useEffect(() => {
    if (!isRunning) {
      setTime(0);
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);
  
  useEffect(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    setFormattedTime(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  }, [time]);

  // Game ranks based on time
  const getRank = () => {
    if (time < 60) return { name: "Rookie", color: "text-slate-400" };
    if (time < 180) return { name: "Explorer", color: "text-blue-400" };
    if (time < 300) return { name: "Expert", color: "text-purple-400" };
    if (time < 600) return { name: "Master", color: "text-amber-400" };
    return { name: "Legend", color: "text-rose-400" };
  };
  
  const rank = getRank();

  return (
    <div className="flex items-center bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-700/50 shadow-sm">
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 mr-1 sm:mr-2" />
      <span className="text-base sm:text-lg font-mono font-medium text-white mr-1 sm:mr-2">{formattedTime}</span>
      <div className={`text-[10px] sm:text-xs font-medium py-0.5 px-1 sm:px-1.5 rounded-md ${rank.color} bg-slate-900/60`}>
        {rank.name}
      </div>
    </div>
  );
};
