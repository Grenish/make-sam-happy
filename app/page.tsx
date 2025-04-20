"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/modal";
import Image from "next/image";
import { Send, Sparkles, Gauge, Brain, History, Trophy } from "lucide-react";
import { useChat } from "ai/react";
import { Timer } from "@/components/timer";
import ScoreTracker from "@/components/score-tracker";
import EmotionHistory from "@/components/emotion-history";
import GameOverModal from "@/components/game-over-modal";

type Emotion = "happy" | "sad" | "smirk" | "doubtful" | "emotionless" | "angry";

interface EmotionScore {
  emotion: Emotion;
  timestamp: number;
}

export default function Home() {
  const wordLimit = 50;
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("emotionless");
  const [samMessage, setSamMessage] = useState<string>("");
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [emotionHistory, setEmotionHistory] = useState<EmotionScore[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const messageBoxRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      const content = message.content;
      console.log("Full response:", content);

      const emotionMatch = content.match(/\[(.*?)\]/i);
      const emotion = emotionMatch ? emotionMatch[1].toLowerCase() as Emotion : currentEmotion;
      const cleanContent = content.replace(/\[(.*?)\]/i, "").trim();

      setCurrentEmotion(emotion);
      setSamMessage(cleanContent);

      updateScoreAndStreak(emotion);

      const newHistory = [...emotionHistory, {
        emotion: emotion,
        timestamp: Date.now()
      }];
      setEmotionHistory(newHistory);

      if (emotion === "happy") {
        setGameWon(true);
        setShowGameOver(true);
        setGameActive(false);
      }
    },
  });

  useEffect(() => {
    const storedHighScore = localStorage.getItem('samHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('samHighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [samMessage]);

  const updateScoreAndStreak = (emotion: Emotion) => {
    const scoreMap: { [key in Emotion]: number } = {
      happy: 100,
      smirk: 50,
      doubtful: 20,
      emotionless: 10,
      sad: -10,
      angry: -30
    };

    const points = scoreMap[emotion];

    if (emotion === 'happy') {
      setStreak(prev => prev + 1);
      setScore(prev => prev + points + (streak * 10));
    } else if (emotion === 'smirk') {
      setScore(prev => prev + points);
      setStreak(0);
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev + points));
    }
  };

  const countWords = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "").length;
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (countWords(text) <= wordLimit) {
      handleInputChange(e);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setStreak(0);
    setEmotionHistory([]);
  };

  const handlePlayAgain = () => {
    setShowGameOver(false);
    setGameWon(false);
    startGame();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <div className="w-full lg:w-1/2 flex flex-col h-screen p-2 sm:p-4 md:p-6">
        <div className="mb-2 sm:mb-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
              Make Sam Happy
            </span>
          </h1>

          {gameActive && (
            <Timer isRunning={gameActive} />
          )}
        </div>
        
        {/* Mobile Sam Display - Show on small screens only */}
        <div className="lg:hidden mb-3 flex flex-col items-center">
          <div className="relative mb-2 flex justify-center w-full">
            <div className={`absolute inset-0 rounded-full blur-xl ${
              currentEmotion === 'happy' ? 'bg-blue-500/10' :
              currentEmotion === 'sad' ? 'bg-slate-500/10' :
              currentEmotion === 'smirk' ? 'bg-amber-500/10' :
              currentEmotion === 'doubtful' ? 'bg-purple-500/10' :
              currentEmotion === 'angry' ? 'bg-red-500/10' :
              'bg-slate-500/10'
            }`}></div>
            <div className="relative flex items-center justify-center">
              <Image
                src={`/${currentEmotion}.png`}
                width={180}
                height={180}
                alt={`Sam feeling ${currentEmotion}`}
                className={`w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] pointer-events-none select-none transition-opacity duration-300 drop-shadow-xl ${
                  isLoading ? 'opacity-60' : 'opacity-100'
                }`}
                priority
              />
            </div>
          </div>
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full mb-2
            ${currentEmotion === 'happy' ? 'bg-blue-900/50 text-blue-200 border border-blue-700' : ''}
            ${currentEmotion === 'sad' ? 'bg-slate-800/50 text-slate-300 border border-slate-700' : ''}
            ${currentEmotion === 'smirk' ? 'bg-amber-900/50 text-amber-200 border border-amber-700' : ''}
            ${currentEmotion === 'doubtful' ? 'bg-purple-900/50 text-purple-200 border border-purple-700' : ''}
            ${currentEmotion === 'emotionless' ? 'bg-slate-800/50 text-slate-300 border border-slate-700' : ''}
            ${currentEmotion === 'angry' ? 'bg-red-900/50 text-red-200 border border-red-700' : ''}
          `}>
            <span className="text-xs font-medium">
              {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
            </span>
          </div>

          {/* Sam's message bubble for mobile */}
          <div
            ref={messageBoxRef}
            className={`w-full px-3 py-2 rounded-xl shadow-lg text-sm
              backdrop-blur-lg transition-all duration-300 overflow-y-auto max-h-24 sm:max-h-28
              ${currentEmotion === 'happy' ? 'bg-blue-900/20 border border-blue-800/40' : ''}
              ${currentEmotion === 'sad' ? 'bg-slate-800/20 border border-slate-700/40' : ''}
              ${currentEmotion === 'smirk' ? 'bg-amber-900/20 border border-amber-800/40' : ''}
              ${currentEmotion === 'doubtful' ? 'bg-purple-900/20 border border-purple-800/40' : ''}
              ${currentEmotion === 'emotionless' ? 'bg-slate-800/20 border border-slate-700/40' : ''}
              ${currentEmotion === 'angry' ? 'bg-red-900/20 border border-red-800/40' : ''}
            `}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  currentEmotion === 'happy' ? 'bg-blue-400' :
                  currentEmotion === 'sad' ? 'bg-slate-400' :
                  currentEmotion === 'smirk' ? 'bg-amber-400' :
                  currentEmotion === 'doubtful' ? 'bg-purple-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse delay-150 ${
                  currentEmotion === 'happy' ? 'bg-blue-400' :
                  currentEmotion === 'sad' ? 'bg-slate-400' :
                  currentEmotion === 'smirk' ? 'bg-amber-400' :
                  currentEmotion === 'doubtful' ? 'bg-purple-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse delay-300 ${
                  currentEmotion === 'happy' ? 'bg-blue-400' :
                  currentEmotion === 'sad' ? 'bg-slate-400' :
                  currentEmotion === 'smirk' ? 'bg-amber-400' :
                  currentEmotion === 'doubtful' ? 'bg-purple-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
              </div>
            ) : (
              samMessage ? (
                <p className="leading-relaxed text-slate-200">{samMessage}</p>
              ) : (
                <p className="text-slate-400 italic text-xs">Start the conversation with Sam...</p>
              )
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 sm:pr-4 pb-2 sm:pb-4 space-y-2 sm:space-y-4 custom-scrollbar">
          <ScoreTracker score={score} highScore={highScore} streak={streak} />

          <div className="bg-slate-800/40 rounded-xl p-2 sm:p-5 border border-slate-700/40 shadow-lg">
            <div className="flex items-center mb-1.5 sm:mb-3">
              <Brain className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <h2 className="font-semibold text-xs sm:text-base text-slate-200">Emotional History</h2>
            </div>
            <EmotionHistory history={emotionHistory} />
          </div>

          <div className="bg-slate-800/40 rounded-xl p-2 sm:p-5 border border-slate-700/40 shadow-lg">
            <div className="flex items-center mb-1.5 sm:mb-3">
              <Trophy className="text-amber-400 w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <h2 className="font-semibold text-xs sm:text-base text-slate-200">Game Objective</h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">Make Sam respond with "happy" to win the game.</p>

            <div className="mt-2 sm:mt-3 bg-indigo-950/60 rounded-lg p-2 sm:p-3 border border-indigo-900/50">
              <div className="flex items-center text-xs sm:text-sm">
                <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full bg-indigo-500 mr-1.5 sm:mr-2"></div>
                <span className="text-indigo-200">
                  {streak > 0 ? "Almost there!" : "Try to make Sam happy!"}
                </span>
              </div>

              <div className="mt-1.5 sm:mt-2 w-full bg-slate-800/70 h-1.5 sm:h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-600 to-blue-400 rounded-full transition-all duration-300"
                  style={{ width: streak > 0 ? "80%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-2 sm:mt-4 bg-slate-800/40 rounded-xl p-2 sm:p-4 border border-slate-700/40 shadow-lg"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Type your message to Sam..."
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12
                text-slate-200 text-sm sm:text-base placeholder:text-slate-500 focus:outline-hidden focus:ring-2 
                focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              value={input}
              onChange={handleCustomInputChange}
              disabled={!gameActive || isLoading}
            />
            <button
              type="submit"
              disabled={!gameActive || isLoading || input.trim() === ""}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full
                ${!gameActive || isLoading || input.trim() === "" 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'}
                transition-all`}
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-2 sm:mt-3 px-1">
            <div className={`text-[10px] sm:text-xs ${
              countWords(input) >= wordLimit
                ? "text-red-400"
                : "text-slate-400"
            }`}>
              {countWords(input)} / {wordLimit} words
            </div>

            {currentEmotion === 'happy' && (
              <div className="flex items-center text-amber-300 text-[10px] sm:text-xs">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                <span>Keep it up!</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Desktop Sam Display */}
      <div className="hidden lg:flex w-1/2 h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 transition-opacity duration-300 opacity-20
            ${currentEmotion === 'happy' ? 'bg-linear-to-br from-blue-600 to-indigo-800' : ''}
            ${currentEmotion === 'sad' ? 'bg-linear-to-br from-slate-700 to-slate-900' : ''}
            ${currentEmotion === 'smirk' ? 'bg-linear-to-br from-amber-500 to-amber-900' : ''}
            ${currentEmotion === 'doubtful' ? 'bg-linear-to-br from-purple-600 to-purple-900' : ''}
            ${currentEmotion === 'emotionless' ? 'bg-linear-to-br from-slate-600 to-slate-800' : ''}
            ${currentEmotion === 'angry' ? 'bg-linear-to-br from-red-600 to-red-900' : ''}
          `}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
          <div className="relative mb-8 flex justify-center items-center">
            <div className={`absolute inset-0 rounded-full blur-2xl ${
              currentEmotion === 'happy' ? 'bg-blue-500/10' :
              currentEmotion === 'sad' ? 'bg-slate-500/10' :
              currentEmotion === 'smirk' ? 'bg-amber-500/10' :
              currentEmotion === 'doubtful' ? 'bg-purple-500/10' :
              currentEmotion === 'angry' ? 'bg-red-500/10' :
              'bg-slate-500/10'
            }`}></div>
            <div className="relative flex items-center justify-center">
              <Image
                src={`/${currentEmotion}.png`}
                width={400}
                height={400}
                alt={`Sam feeling ${currentEmotion}`}
                className={`pointer-events-none select-none transition-opacity duration-300 drop-shadow-2xl ${
                  isLoading ? 'opacity-60' : 'opacity-100'
                }`}
                priority
              />
            </div>
          </div>

          <div className={`inline-flex items-center px-3 py-1.5 rounded-full mb-6
            ${currentEmotion === 'happy' ? 'bg-blue-900/50 text-blue-200 border border-blue-700' : ''}
            ${currentEmotion === 'sad' ? 'bg-slate-800/50 text-slate-300 border border-slate-700' : ''}
            ${currentEmotion === 'smirk' ? 'bg-amber-900/50 text-amber-200 border border-amber-700' : ''}
            ${currentEmotion === 'doubtful' ? 'bg-purple-900/50 text-purple-200 border border-purple-700' : ''}
            ${currentEmotion === 'emotionless' ? 'bg-slate-800/50 text-slate-300 border border-slate-700' : ''}
            ${currentEmotion === 'angry' ? 'bg-red-900/50 text-red-200 border border-red-700' : ''}
          `}>
            <span className="text-sm font-medium">
              {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
            </span>
          </div>

          <div
            ref={messageBoxRef}
            className={`w-full max-w-lg px-6 py-4 rounded-2xl shadow-lg 
              backdrop-blur-lg transition-all duration-300 overflow-y-auto max-h-40
              ${currentEmotion === 'happy' ? 'bg-blue-900/20 border border-blue-800/40' : ''}
              ${currentEmotion === 'sad' ? 'bg-slate-800/20 border border-slate-700/40' : ''}
              ${currentEmotion === 'smirk' ? 'bg-amber-900/20 border border-amber-800/40' : ''}
              ${currentEmotion === 'doubtful' ? 'bg-purple-900/20 border border-purple-800/40' : ''}
              ${currentEmotion === 'emotionless' ? 'bg-slate-800/20 border border-slate-700/40' : ''}
              ${currentEmotion === 'angry' ? 'bg-red-900/20 border border-red-800/40' : ''}
            `}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  currentEmotion === 'happy' ? 'bg-blue-400' :
                  currentEmotion === 'sad' ? 'bg-slate-400' :
                  currentEmotion === 'smirk' ? 'bg-amber-400' :
                  currentEmotion === 'doubtful' ? 'bg-purple-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-pulse delay-150 ${
                  currentEmotion === 'happy' ? 'bg-blue-400' :
                  currentEmotion === 'sad' ? 'bg-slate-400' :
                  currentEmotion === 'smirk' ? 'bg-amber-400' :
                  currentEmotion === 'doubtful' ? 'bg-purple-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-pulse delay-300 ${
                  currentEmotion === 'happy' ? 'bg-blue-400' :
                  currentEmotion === 'sad' ? 'bg-slate-400' :
                  currentEmotion === 'smirk' ? 'bg-amber-400' :
                  currentEmotion === 'doubtful' ? 'bg-purple-400' :
                  currentEmotion === 'angry' ? 'bg-red-400' :
                  'bg-slate-400'
                }`}></div>
              </div>
            ) : (
              samMessage ? (
                <p className="leading-relaxed text-slate-200">{samMessage}</p>
              ) : (
                <p className="text-slate-400 italic">Start the conversation with Sam...</p>
              )
            )}
          </div>
        </div>
      </div>

      {!gameActive && !showGameOver && <Modal onStartGame={startGame} />}
      {showGameOver && <GameOverModal won={gameWon} score={score} onPlayAgain={handlePlayAgain} />}
    </div>
  );
}
