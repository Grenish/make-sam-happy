"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/modal";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { useChat } from "ai/react";

type Emotion = "happy" | "sad" | "smirk" | "doubtful" | "emotionless" | "angry";

export default function Home() {
  const wordLimit = 50;
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("emotionless");
  const [samMessage, setSamMessage] = useState<string>("");
  const messageBoxRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      console.log("Full response:", message.content);
      const [emotion, ...content] = message.content.split("\n");
      setCurrentEmotion(emotion.toLowerCase() as Emotion);
      setSamMessage(content.join("\n").trim());
    },
  });

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [samMessage]); // Update scroll position when samMessage changes

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative">
      <Modal />

      <h2 className="text-3xl font-semibold mb-4">Make Sam Happy</h2>

      <div className="relative w-60 h-60">
        <Image
          src={`/${currentEmotion}.png`}
          width={300}
          height={300}
          alt={`Sam feeling ${currentEmotion}`}
          className="pointer-events-none select-none"
        />
      </div>

      <div
        ref={messageBoxRef}
        className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700 overflow-y-auto max-h-40"
      >
        {samMessage && (
          <p className="leading-relaxed">{samMessage}</p>
        )}
      </div>

      <div className="absolute bottom-5 w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700"
        >
          <input
            type="text"
            className="bg-transparent outline-none w-full text-gray-300 p-2"
            placeholder="Make Sam happy!"
            value={input}
            onChange={handleCustomInputChange}
          />
          <div className="w-full flex items-center justify-between">
            <p
              className={`text-sm ${
                countWords(input) >= wordLimit
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {countWords(input)} / {wordLimit} words
            </p>
            <button
              type="submit"
              className="p-1 rounded-md border-2 border-gray-400"
              disabled={input.trim() === ""}
            >
              <ArrowUp className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
