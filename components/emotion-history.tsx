"use client";

type Emotion = "happy" | "sad" | "smirk" | "doubtful" | "emotionless" | "angry";

interface EmotionScore {
  emotion: Emotion;
  timestamp: number;
}

interface EmotionHistoryProps {
  history: EmotionScore[];
}

export default function EmotionHistory({ history }: EmotionHistoryProps) {
  // Game-appropriate colors for emotions
  const emotionColors: Record<Emotion, { bg: string, text: string }> = {
    happy: { bg: "bg-blue-500", text: "text-blue-200" },
    sad: { bg: "bg-slate-500", text: "text-slate-200" },
    smirk: { bg: "bg-amber-500", text: "text-amber-200" },
    doubtful: { bg: "bg-purple-500", text: "text-purple-200" },
    emotionless: { bg: "bg-slate-400", text: "text-slate-200" },
    angry: { bg: "bg-red-500", text: "text-red-200" }
  };

  // Show only the last 8 emotions
  const recentHistory = history.slice(-8);
  
  if (recentHistory.length === 0) return null;
  
  return (
    <div className="w-full game-card">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <p className="text-[10px] sm:text-xs font-bold text-slate-300">Emotional Journey</p>
        {recentHistory.length > 0 && (
          <span className="text-[10px] sm:text-xs text-slate-400">
            {recentHistory.length} interaction{recentHistory.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {recentHistory.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`h-2 w-10 sm:h-2 sm:w-10 ${emotionColors[item.emotion].bg} rounded-sm 
                ${index === recentHistory.length - 1 ? "ring-1 ring-white/20" : ""}`}
              title={`${item.emotion} at ${new Date(item.timestamp).toLocaleTimeString()}`}
            />
            {index === recentHistory.length - 1 && (
              <span className={`text-[8px] sm:text-[10px] ${emotionColors[item.emotion].text} capitalize mt-1`}>
                {item.emotion}
              </span>
            )}
          </div>
        ))}
        
        {/* Fill empty slots */}
        {Array(Math.max(0, 8 - recentHistory.length)).fill(0).map((_, i) => (
          <div key={`empty-${i}`} className="flex flex-col items-center">
            <div className="h-2 w-10 sm:h-2 sm:w-10 bg-slate-800/50 border border-slate-700/30 rounded-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}
