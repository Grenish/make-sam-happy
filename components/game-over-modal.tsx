"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, RefreshCw, Share2 } from "lucide-react";

interface GameOverModalProps {
  won: boolean;
  score: number;
  onPlayAgain: () => void;
}

export default function GameOverModal({ won, score, onPlayAgain }: GameOverModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (won) {
      setShowConfetti(true);
      
      // Load confetti dynamically when winning
      import('canvas-confetti').then(confetti => {
        const duration = 2000;
        const end = Date.now() + duration;
        
        function frame() {
          confetti.default({
            particleCount: 5,
            angle: 60,
            spread: 45,
            origin: { x: 0, y: 0.8 },
            colors: ['#60a5fa', '#93c5fd', '#3b82f6']
          });
          
          confetti.default({
            particleCount: 5,
            angle: 120,
            spread: 45,
            origin: { x: 1, y: 0.8 },
            colors: ['#60a5fa', '#93c5fd', '#3b82f6']
          });
        
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }
        
        frame();
      });
    }
  }, [won]);

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Make Sam Happy',
        text: `I ${won ? 'made Sam happy' : 'tried to cheer up Sam'} with a score of ${score}! Can you do better?`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `I ${won ? 'made Sam happy' : 'tried to cheer up Sam'} with a score of ${score} in Make Sam Happy! Try it yourself: ${window.location.href}`
      );
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 text-slate-200 p-4 sm:p-6 rounded-lg border border-slate-800 max-w-md w-[90%] sm:w-[95%] transform transition-all scale-100 opacity-100 z-50 fade-in shadow-xl">
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            {won ? (
              <div className="bg-blue-900/20 p-3 sm:p-4 rounded-full">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
              </div>
            ) : (
              <Image 
                src="/sad.png" 
                width={70} 
                height={70} 
                alt="Sad Sam" 
                className="sm:w-[80px] sm:h-[80px] rounded-full border border-slate-800 shadow-lg"
              />
            )}
          </div>
          
          <h2 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 text-center">
            {won ? "Mission Accomplished" : "Try Again"}
          </h2>
          
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm">
              {won 
                ? "You've successfully improved Sam's mood through thoughtful communication."
                : "Sam is still feeling down. Different approaches might help next time."
              }
            </p>
            
            <div className="mt-6 p-4 bg-slate-800/50 rounded-md border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-1">Final Score</div>
              <p className="text-2xl font-medium text-white">
                {score}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              onClick={onPlayAgain}
            >
              <RefreshCw size={16} className="mr-2" />
              Play Again
            </button>
            
            <button
              className="flex-1 bg-slate-700 text-white py-2 px-3 rounded-md hover:bg-slate-600 transition-colors flex items-center justify-center"
              onClick={shareResult}
            >
              <Share2 size={16} className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
