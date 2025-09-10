"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, MessagesSquare, Book, PuzzleIcon, BrainCircuit } from "lucide-react";

interface ModalProps {
  onStartGame: () => void;
}

export default function Modal({ onStartGame }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"></div>

      {/* Modal Content */}
      <div className="relative bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-xl shadow-xl 
        w-[98%] sm:w-[90%] max-w-2xl z-50 overflow-hidden border border-slate-800">
        
        {/* Header with visual impact */}
        <div className="relative h-24 sm:h-32 md:h-40 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-50"></div>
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6">
            <div className="flex items-center">
              <div className="mr-2 sm:mr-4 bg-slate-800/80 p-1 sm:p-2 rounded-lg border border-slate-700/50">
                <Image 
                  src="/emotionless.png" 
                  alt="Sam" 
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] rounded-md sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold">Make Sam Happy</h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300">A game of emotional intelligence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs navigation - scrollable on small screens */}
        <div className="flex overflow-x-auto border-b border-slate-800 no-scrollbar">
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex items-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
              activeTab === 'about' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/30' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/10'
            } transition-colors`}
          >
            <MessagesSquare size={14} className="mr-1.5 sm:mr-2" />
            About
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`flex items-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
              activeTab === 'rules' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/30' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/10'
            } transition-colors`}
          >
            <Book size={14} className="mr-1.5 sm:mr-2" />
            How to Play
          </button>
          <button 
            onClick={() => setActiveTab('tips')}
            className={`flex items-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
              activeTab === 'tips' 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/30' 
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/10'
            } transition-colors`}
          >
            <BrainCircuit size={14} className="mr-1.5 sm:mr-2" />
            Strategy
          </button>
        </div>

        {/* Tab content */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">
                Sam is struggling with persistent melancholy and emotional distance. Your challenge is to 
                break through these emotional barriers through thoughtful conversation.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center text-sm sm:text-base">
                    <MessagesSquare size={16} className="text-blue-400 mr-2" />
                    Character Profile
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Introspective and thoughtful
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Emotionally complex
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Deep-seated sadness
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Seeking authentic connection
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center text-sm sm:text-base">
                    <Book size={16} className="text-blue-400 mr-2" />
                    Emotional States
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs sm:text-sm">
                    <div className="px-2 py-1 bg-blue-900/40 rounded-sm text-blue-200 border border-blue-800/40">Happy</div>
                    <div className="px-2 py-1 bg-slate-800/40 rounded-sm text-slate-300 border border-slate-700/40">Sad</div>
                    <div className="px-2 py-1 bg-amber-900/40 rounded-sm text-amber-200 border border-amber-800/40">Smirk</div>
                    <div className="px-2 py-1 bg-purple-900/40 rounded-sm text-purple-200 border border-purple-800/40">Doubtful</div>
                    <div className="px-2 py-1 bg-slate-800/40 rounded-sm text-slate-300 border border-slate-700/40">Neutral</div>
                    <div className="px-2 py-1 bg-red-900/40 rounded-sm text-red-200 border border-red-800/40">Angry</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/40 mb-4 flex items-start">
                <PuzzleIcon size={20} className="text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200 mb-1 text-sm sm:text-base">Game Objective</h4>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    Make Sam respond with "happy" just one time to win the game.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300 text-xs sm:text-sm">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 mr-3 mt-0.5 font-bold text-sm border border-slate-700">1</div>
                  <p className="flex-1">
                    Send thoughtful messages to Sam to improve their emotional state
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 mr-3 mt-0.5 font-bold text-sm border border-slate-700">2</div>
                  <p className="flex-1">
                    Pay attention to emotional responses and adapt your approach accordingly
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 mr-3 mt-0.5 font-bold text-sm border border-slate-700">3</div>
                  <p className="flex-1">
                    Earn points based on Sam's emotional responses, with bonuses for streaks
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 mr-3 mt-0.5 font-bold text-sm border border-slate-700">4</div>
                  <p className="flex-1">
                    Try to achieve the highest score possible before reaching your objective
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <p className="mb-3 text-slate-300 text-sm sm:text-base">
                Communicate effectively with Sam using these strategies:
              </p>
              
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40 flex items-start">
                <span className="w-6 h-6 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center text-blue-400 mr-3">1</span>
                <div className="flex-1">
                  <h4 className="text-slate-200 font-bold mb-1 text-sm sm:text-base">Show Authentic Empathy</h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Acknowledge Sam's feelings without trying to force positivity or minimize emotions.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40 flex items-start">
                <span className="w-6 h-6 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center text-blue-400 mr-3">2</span>
                <div className="flex-1">
                  <h4 className="text-slate-200 font-bold mb-1 text-sm sm:text-base">Ask Thoughtful Questions</h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Show genuine interest in Sam's perspective and experiences through open-ended questions.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/40 flex items-start">
                <span className="w-6 h-6 rounded-full bg-blue-900/40 border border-blue-700 flex items-center justify-center text-blue-400 mr-3">3</span>
                <div className="flex-1">
                  <h4 className="text-slate-200 font-bold mb-1 text-sm sm:text-base">Share Related Experiences</h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Find common ground by sharing relevant experiences, but avoid making the conversation about yourself.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="p-3 sm:p-4 md:p-6 bg-slate-800/20 border-t border-slate-800">
          <button
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
              active:from-blue-700 active:to-indigo-700 text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg font-bold text-base sm:text-lg
              transition-all transform hover:translate-y-[-1px] active:translate-y-[1px]
              shadow-lg shadow-blue-500/20 flex items-center justify-center"
            onClick={() => {
              setIsOpen(false);
              onStartGame();
            }}
          >
            <Play size={18} className="mr-2" />
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
