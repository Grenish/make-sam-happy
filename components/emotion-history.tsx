"use client";

import { memo, useMemo } from "react";

type Emotion = "happy" | "sad" | "smirk" | "doubtful" | "emotionless" | "angry" | "hopeful";

interface EmotionScore {
  emotion: Emotion;
  timestamp: number;
}

interface EmotionHistoryProps {
  history: EmotionScore[];
}

// Constants moved outside component to prevent recreation
const MAX_VISIBLE_EMOTIONS = 8;

const EMOTION_CONFIG: Record<Emotion, { 
  bg: string; 
  text: string; 
  glow?: string;
  priority: number; // for visual emphasis
}> = {
  happy: { 
    bg: "bg-gradient-to-r from-blue-500 to-blue-400", 
    text: "text-blue-200",
    glow: "shadow-blue-500/30",
    priority: 3
  },
  hopeful: { 
    bg: "bg-gradient-to-r from-teal-500 to-teal-400", 
    text: "text-teal-200",
    glow: "shadow-teal-500/30",
    priority: 2
  },
  smirk: { 
    bg: "bg-gradient-to-r from-amber-500 to-amber-400", 
    text: "text-amber-200",
    glow: "shadow-amber-500/30",
    priority: 1
  },
  doubtful: { 
    bg: "bg-gradient-to-r from-purple-500 to-purple-400", 
    text: "text-purple-200",
    priority: 0
  },
  emotionless: { 
    bg: "bg-slate-600", 
    text: "text-slate-300",
    priority: 0
  },
  sad: { 
    bg: "bg-slate-500", 
    text: "text-slate-200",
    priority: -1
  },
  angry: { 
    bg: "bg-gradient-to-r from-red-500 to-red-400", 
    text: "text-red-200",
    priority: -1
  },
};

// Emotion icons for visual clarity
const EMOTION_ICONS: Record<Emotion, string> = {
  happy: "😊",
  hopeful: "🤗",
  smirk: "😏",
  doubtful: "🤔",
  emotionless: "😐",
  sad: "😢",
  angry: "😠",
};

const EmotionBar = memo(({ 
  emotion, 
  timestamp, 
  isLatest, 
  index 
}: { 
  emotion: Emotion; 
  timestamp: number; 
  isLatest: boolean; 
  index: number;
}) => {
  const config = EMOTION_CONFIG[emotion];
  const timeString = useMemo(() => 
    new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }), [timestamp]
  );

  return (
    <div 
      className="flex flex-col items-center group relative"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Tooltip on hover */}
      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity
        bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10
        pointer-events-none">
        {EMOTION_ICONS[emotion]} {timeString}
      </div>

      {/* Emotion bar */}
      <div
        className={`
          relative overflow-hidden
          h-2 sm:h-2.5 w-8 sm:w-10 
          ${config.bg} 
          rounded-sm transition-all duration-300
          ${isLatest ? 'ring-2 ring-white/30 scale-110' : 'hover:scale-105'}
          ${config.glow && isLatest ? `shadow-lg ${config.glow}` : ''}
          ${config.priority > 1 ? 'animate-pulse' : ''}
        `}
        title={`${emotion} at ${timeString}`}
      >
        {/* Shimmer effect for positive emotions */}
        {config.priority > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
            -translate-x-full animate-shimmer" />
        )}
      </div>

      {/* Latest emotion label */}
      {isLatest && (
        <div className="flex flex-col items-center mt-1">
          <span className={`text-[10px] sm:text-xs ${config.text} font-medium capitalize`}>
            {emotion}
          </span>
          <span className="text-[8px] text-slate-500">now</span>
        </div>
      )}
    </div>
  );
});

EmotionBar.displayName = 'EmotionBar';

const EmptySlot = memo(() => (
  <div className="flex flex-col items-center">
    <div className="h-2 sm:h-2.5 w-8 sm:w-10 bg-slate-800/50 border border-slate-700/30 
      rounded-sm opacity-50" />
  </div>
));

EmptySlot.displayName = 'EmptySlot';

function EmotionHistory({ history }: EmotionHistoryProps) {
  // Memoize recent history
  const recentHistory = useMemo(() => 
    history.slice(-MAX_VISIBLE_EMOTIONS),
    [history]
  );

  // Calculate emotional trend
  const emotionalTrend = useMemo(() => {
    if (recentHistory.length < 2) return 'neutral';
    
    const recentScores = recentHistory.slice(-3).map(h => 
      EMOTION_CONFIG[h.emotion].priority
    );
    const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    
    if (avgScore > 1) return 'improving';
    if (avgScore < -0.5) return 'declining';
    return 'stable';
  }, [recentHistory]);

  const trendColors = {
    improving: 'text-green-400',
    declining: 'text-red-400',
    stable: 'text-slate-400',
    neutral: 'text-slate-500'
  };

  const trendIcons = {
    improving: '↗️',
    declining: '↘️',
    stable: '→',
    neutral: '•'
  };

  if (recentHistory.length === 0) {
    return (
      <div className="w-full">
        <p className="text-xs text-slate-500 text-center py-4">
          No emotional data yet. Start talking to Sam!
        </p>
      </div>
    );
  }

  const emptySlots = Math.max(0, MAX_VISIBLE_EMOTIONS - recentHistory.length);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            Emotional Journey
          </p>
          <span className={`text-xs ${trendColors[emotionalTrend]} flex items-center`}>
            {trendIcons[emotionalTrend]}
            <span className="ml-1 hidden sm:inline">{emotionalTrend}</span>
          </span>
        </div>
        <span className="text-[10px] sm:text-xs text-slate-400">
          {recentHistory.length}/{MAX_VISIBLE_EMOTIONS}
        </span>
      </div>

      <div className="flex gap-1.5 sm:gap-2 items-end">
        {/* Empty slots first for left alignment */}
        {Array(emptySlots).fill(0).map((_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
        
        {/* Emotion bars */}
        {recentHistory.map((item, index) => (
          <EmotionBar
            key={`${item.timestamp}-${index}`}
            emotion={item.emotion}
            timestamp={item.timestamp}
            isLatest={index === recentHistory.length - 1}
            index={index}
          />
        ))}
      </div>

      {/* Progress indicator */}
      {recentHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700/30">
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-slate-500">
              Happiness Score:
            </span>
            <div className="flex items-center gap-2">
              {recentHistory.filter(h => h.emotion === 'happy').length > 0 && (
                <span className="text-blue-400">
                  {recentHistory.filter(h => h.emotion === 'happy').length} happy
                </span>
              )}
              {recentHistory.filter(h => h.emotion === 'hopeful').length > 0 && (
                <span className="text-teal-400">
                  {recentHistory.filter(h => h.emotion === 'hopeful').length} hopeful
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(EmotionHistory);