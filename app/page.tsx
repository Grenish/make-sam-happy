"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Modal from "@/components/modal";
import Image from "next/image";
import { Send, Sparkles, Brain, Trophy, TrendingUp, Heart } from "lucide-react";
import { useChat } from "ai/react";
import { Timer } from "@/components/timer";
import ScoreTracker from "@/components/score-tracker";
import EmotionHistory from "@/components/emotion-history";
import GameOverModal from "@/components/game-over-modal";

type Emotion =
  | "happy"
  | "sad"
  | "smirk"
  | "doubtful"
  | "emotionless"
  | "angry"
  | "hopeful";

interface EmotionScore {
  emotion: Emotion;
  timestamp: number;
}

const WORD_LIMIT = 50;
const EMOTION_SCORES: Record<Emotion, number> = {
  happy: 100,
  hopeful: 70,
  smirk: 50,
  doubtful: 20,
  emotionless: 10,
  sad: -10,
  angry: -30,
};

const EMOTION_STYLES = {
  happy: {
    gradient: "from-blue-950 via-cyan-950 to-slate-950",
    bubble: "bg-blue-900/20 border-blue-800/40",
    badge: "bg-blue-900/50 text-blue-200 border-blue-700",
    pulse: "bg-blue-400",
    glow: "bg-blue-500/10",
    overlay: "from-blue-600 to-indigo-800",
  },
  hopeful: {
    gradient: "from-teal-950 via-emerald-950 to-slate-950",
    bubble: "bg-teal-900/20 border-teal-800/40",
    badge: "bg-teal-900/50 text-teal-200 border-teal-700",
    pulse: "bg-teal-400",
    glow: "bg-teal-500/10",
    overlay: "from-teal-600 to-emerald-800",
  },
  sad: {
    gradient: "from-slate-950 via-gray-900 to-slate-950",
    bubble: "bg-slate-800/20 border-slate-700/40",
    badge: "bg-slate-800/50 text-slate-300 border-slate-700",
    pulse: "bg-slate-400",
    glow: "bg-slate-500/10",
    overlay: "from-slate-700 to-slate-900",
  },
  smirk: {
    gradient: "from-amber-950 via-orange-950 to-slate-950",
    bubble: "bg-amber-900/20 border-amber-800/40",
    badge: "bg-amber-900/50 text-amber-200 border-amber-700",
    pulse: "bg-amber-400",
    glow: "bg-amber-500/10",
    overlay: "from-amber-500 to-amber-900",
  },
  doubtful: {
    gradient: "from-purple-950 via-violet-900 to-slate-950",
    bubble: "bg-purple-900/20 border-purple-800/40",
    badge: "bg-purple-900/50 text-purple-200 border-purple-700",
    pulse: "bg-purple-400",
    glow: "bg-purple-500/10",
    overlay: "from-purple-600 to-purple-900",
  },
  emotionless: {
    gradient: "from-slate-950 via-indigo-950 to-slate-950",
    bubble: "bg-slate-800/20 border-slate-700/40",
    badge: "bg-slate-800/50 text-slate-300 border-slate-700",
    pulse: "bg-slate-400",
    glow: "bg-slate-500/10",
    overlay: "from-slate-600 to-slate-800",
  },
  angry: {
    gradient: "from-red-950 via-rose-900 to-slate-950",
    bubble: "bg-red-900/20 border-red-800/40",
    badge: "bg-red-900/50 text-red-200 border-red-700",
    pulse: "bg-red-400",
    glow: "bg-red-500/10",
    overlay: "from-red-600 to-red-900",
  },
};

export default function Home() {
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

  const [imgSrc, setImgSrc] = useState<string>(`/${currentEmotion}.png`);

  useEffect(() => {
    setImgSrc(`/${currentEmotion}.png`);
  }, [currentEmotion]);

  const getEmotionStyle = useMemo(() => {
    return EMOTION_STYLES[currentEmotion] || EMOTION_STYLES.emotionless;
  }, [currentEmotion]);

  const updateScoreAndStreak = useCallback((emotion: Emotion) => {
    const points = EMOTION_SCORES[emotion];

    if (emotion === "happy") {
      setStreak((prev) => {
        const newStreak = prev + 1;
        setScore((current) => current + points + newStreak * 10);
        return newStreak;
      });
    } else if (emotion === "hopeful" || emotion === "smirk") {
      setScore((prev) => prev + points);
      if (emotion === "hopeful") {
        setStreak((prev) => Math.min(prev + 0.5, 5)); // Hopeful builds streak slowly
      } else {
        setStreak(0);
      }
    } else {
      setStreak(0);
      setScore((prev) => Math.max(0, prev + points));
    }
  }, []);

  const { input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onFinish: useCallback(
      (message: any) => {
        const content = message.content;

        const emotionMatch = content.match(/```math\s*([\s\S]*?)\s*```/i);
        const emotion = emotionMatch
          ? (emotionMatch[1].trim().toLowerCase() as Emotion)
          : currentEmotion;
        const cleanContent = content
          .replace(/```math\s*([\s\S]*?)\s*```/i, "")
          .trim();

        setCurrentEmotion(emotion);
        setSamMessage(cleanContent);
        updateScoreAndStreak(emotion);

        setEmotionHistory((prev) => [
          ...prev,
          {
            emotion,
            timestamp: Date.now(),
          },
        ]);

        if (emotion === "happy") {
          setGameWon(true);
          setShowGameOver(true);
          setGameActive(false);
        }
      },
      [currentEmotion, updateScoreAndStreak]
    ),
  });

  // Load high score on mount
  useEffect(() => {
    const storedHighScore = localStorage.getItem("samHighScore");
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore));
    }
  }, []);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("samHighScore", score.toString());
    }
  }, [score, highScore]);

  // Auto-scroll message box
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [samMessage]);

  const countWords = useCallback((text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "").length;
  }, []);

  const handleCustomInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      if (countWords(text) <= WORD_LIMIT) {
        handleInputChange(e);
      }
    },
    [countWords, handleInputChange]
  );

  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setStreak(0);
    setEmotionHistory([]);
    setCurrentEmotion("emotionless");
    setSamMessage("");
  }, []);

  const handlePlayAgain = useCallback(() => {
    setShowGameOver(false);
    setGameWon(false);
    startGame();
  }, [startGame]);

  // Progress calculation for game objective
  const gameProgress = useMemo(() => {
    if (currentEmotion === "happy") return 100;
    if (currentEmotion === "hopeful") return 75;
    if (currentEmotion === "smirk") return 50;
    if (streak > 0) return Math.min(80, 50 + streak * 10);
    return 0;
  }, [currentEmotion, streak]);

  // Loading dots component
  const LoadingDots = () => (
    <div className="flex items-center space-x-2">
      {[0, 150, 300].map((delay, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${getEmotionStyle.pulse}`}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row text-white transition-colors duration-500 bg-gradient-to-br ${getEmotionStyle.gradient}`}
    >
      {/* Left Panel - Game Controls */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen p-2 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-2 sm:mb-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
              Make Sam Happy
            </span>
          </h1>
          {gameActive && <Timer isRunning={gameActive} />}
        </div>

        {/* Mobile Sam Display */}
        <div className="lg:hidden mb-3 flex flex-col items-center">
          <div className="relative mb-2 flex justify-center w-full">
            <div
              className={`absolute inset-0 rounded-full blur-xl ${getEmotionStyle.glow}`}
            />
            <div className="relative flex items-center justify-center">
              <Image
                src={imgSrc}
                width={180}
                height={180}
                alt={`Sam feeling ${currentEmotion}`}
                className={`w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] 
                  pointer-events-none select-none transition-all duration-300 drop-shadow-xl
                  ${
                    isLoading ? "opacity-60 scale-95" : "opacity-100 scale-100"
                  }`}
                priority
                onError={() => {
                  // fallback to a safe default if file missing
                  setImgSrc("/images/emotionless.png");
                }}
              />
            </div>
          </div>

          {/* Emotion Badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full mb-2 ${getEmotionStyle.badge}`}
          >
            {currentEmotion === "hopeful" && <Heart className="w-3 h-3 mr-1" />}
            {currentEmotion === "happy" && (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            <span className="text-xs font-medium capitalize">
              {currentEmotion}
            </span>
          </div>

          {/* Sam's message bubble for mobile */}
          <div
            ref={messageBoxRef}
            className={`w-full px-3 py-2 rounded-xl shadow-lg text-sm
              backdrop-blur-lg transition-all duration-300 overflow-y-auto max-h-24 sm:max-h-28
              ${getEmotionStyle.bubble}`}
          >
            {isLoading ? (
              <LoadingDots />
            ) : samMessage ? (
              <p className="leading-relaxed text-slate-200">{samMessage}</p>
            ) : (
              <p className="text-slate-400 italic text-xs">
                Start the conversation with Sam...
              </p>
            )}
          </div>
        </div>

        {/* Game Stats Area */}
        <div className="flex-1 overflow-y-auto pr-1 sm:pr-4 pb-2 sm:pb-4 space-y-2 sm:space-y-4 custom-scrollbar">
          <ScoreTracker score={score} highScore={highScore} streak={streak} />

          {/* Emotional History */}
          <div className="bg-slate-800/40 rounded-xl p-2 sm:p-5 border border-slate-700/40 shadow-lg backdrop-blur-sm">
            <div className="flex items-center mb-1.5 sm:mb-3">
              <Brain className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <h2 className="font-semibold text-xs sm:text-base text-slate-200">
                Emotional History
              </h2>
            </div>
            <EmotionHistory history={emotionHistory} />
          </div>

          {/* Game Objective */}
          <div className="bg-slate-800/40 rounded-xl p-2 sm:p-5 border border-slate-700/40 shadow-lg backdrop-blur-sm">
            <div className="flex items-center mb-1.5 sm:mb-3">
              <Trophy className="text-amber-400 w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <h2 className="font-semibold text-xs sm:text-base text-slate-200">
                Game Objective
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-3">
              Make Sam respond with "happy" to win the game.
            </p>

            {/* Progress Indicator */}
            <div className="bg-indigo-950/60 rounded-lg p-2 sm:p-3 border border-indigo-900/50">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400 mr-1.5" />
                  <span className="text-indigo-200">
                    {currentEmotion === "happy"
                      ? "You did it!"
                      : currentEmotion === "hopeful"
                      ? "Almost there!"
                      : currentEmotion === "smirk"
                      ? "Good progress!"
                      : streak > 0
                      ? "Keep going!"
                      : "Start cheering Sam up!"}
                  </span>
                </div>
                <span className="text-indigo-300 font-medium">
                  {gameProgress}%
                </span>
              </div>

              <div className="w-full bg-slate-800/70 h-1.5 sm:h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out
                    ${
                      currentEmotion === "happy"
                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                        : currentEmotion === "hopeful"
                        ? "bg-gradient-to-r from-teal-500 to-cyan-400"
                        : "bg-gradient-to-r from-indigo-600 to-blue-400"
                    }`}
                  style={{ width: `${gameProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-2 sm:mt-4 bg-slate-800/40 rounded-xl p-2 sm:p-4 border border-slate-700/40 shadow-lg backdrop-blur-sm"
        >
          <div className="relative">
            <input
              type="text"
              placeholder={
                gameActive
                  ? "Type your message to Sam..."
                  : "Start the game first!"
              }
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
                transition-all duration-200 ${
                  !gameActive || isLoading || input.trim() === ""
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                }`}
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-2 sm:mt-3 px-1">
            <div
              className={`text-[10px] sm:text-xs transition-colors ${
                countWords(input) >= WORD_LIMIT
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >
              {countWords(input)} / {WORD_LIMIT} words
            </div>

            {(currentEmotion === "happy" || currentEmotion === "hopeful") && (
              <div className="flex items-center text-amber-300 text-[10px] sm:text-xs animate-pulse">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                <span>
                  {currentEmotion === "happy" ? "Amazing!" : "Keep it up!"}
                </span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Desktop Sam Display */}
      <div className="hidden lg:flex w-1/2 h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 transition-opacity duration-300 opacity-20 bg-linear-to-br ${getEmotionStyle.overlay}`}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
          <div className="relative mb-8 flex justify-center items-center">
            <div
              className={`absolute inset-0 rounded-full blur-2xl ${getEmotionStyle.glow}`}
            />
            <div className="relative flex items-center justify-center">
              <Image
                src={imgSrc}
                width={400}
                height={400}
                alt={`Sam feeling ${currentEmotion}`}
                className={`pointer-events-none select-none transition-all duration-300 drop-shadow-2xl
                  ${
                    isLoading ? "opacity-60 scale-95" : "opacity-100 scale-100"
                  }`}
                priority
                onError={() => {
                  setImgSrc("/images/emotionless.png");
                }}
              />
            </div>
          </div>

          {/* Emotion Badge */}
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full mb-6 ${getEmotionStyle.badge}`}
          >
            {currentEmotion === "hopeful" && (
              <Heart className="w-4 h-4 mr-1.5" />
            )}
            {currentEmotion === "happy" && (
              <Sparkles className="w-4 h-4 mr-1.5" />
            )}
            <span className="text-sm font-medium capitalize">
              {currentEmotion}
            </span>
          </div>

          {/* Message Box */}
          <div
            ref={messageBoxRef}
            className={`w-full max-w-lg px-6 py-4 rounded-2xl shadow-lg 
              backdrop-blur-lg transition-all duration-300 overflow-y-auto max-h-40
              ${getEmotionStyle.bubble}`}
          >
            {isLoading ? (
              <LoadingDots />
            ) : samMessage ? (
              <p className="leading-relaxed text-slate-200">{samMessage}</p>
            ) : (
              <p className="text-slate-400 italic">
                Start the conversation with Sam...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className={`absolute w-96 h-96 rounded-full filter blur-3xl opacity-10 -top-20 -left-20 
          animate-pulse-slow ${getEmotionStyle.pulse}`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full filter blur-3xl opacity-10 -bottom-32 -right-20 
          animate-pulse-slow animation-delay-2000 ${getEmotionStyle.pulse}`}
        />
      </div>

      {/* Modals */}
      {!gameActive && !showGameOver && <Modal onStartGame={startGame} />}
      {showGameOver && (
        <GameOverModal
          won={gameWon}
          score={score}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
