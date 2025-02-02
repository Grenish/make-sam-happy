"use client";

import { useState, useEffect } from "react";

export const Timer = ({ isRunning }: { isRunning: boolean }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return <h2 className="text-xl font-semibold">{time}</h2>;
};
