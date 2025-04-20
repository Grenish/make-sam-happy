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
    <div className="flex items-center bg-slate-800/80 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full border border-slate-700/50 shadow-xs">
      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-slate-400 mr-1 sm:mr-1.5 md:mr-2" />
      <span className="text-sm sm:text-base md:text-lg font-mono font-medium text-white mr-1 sm:mr-1.5 md:mr-2">{formattedTime}</span>
      <div className={`text-[9px] sm:text-[10px] md:text-xs font-medium py-0.5 px-1 sm:px-1.5 rounded-md ${rank.color} bg-slate-900/60`}>
        {rank.name}
      </div>
    </div>
  );
};
