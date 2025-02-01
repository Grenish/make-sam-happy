"use client";

import { useEffect, useState } from "react";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-96 transform transition-all scale-100 opacity-100 z-50 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-200">Meet Sam</h2>
        <p className="text-gray-400 mt-2">
          Sam is struggling with loneliness and sadness. He feels disconnected
          from the world, but deep inside, he longs for someone to truly listen.
        </p>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Personality Traits
          </h3>
          <ul className="list-disc list-inside text-gray-400 mt-2">
            <li>Thoughtful and introspective</li>
            <li>Emotionally sensitive</li>
            <li>Values deep connections</li>
            <li>Needs reassurance and support</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-gray-300">Your Mission</h3>
          <p className="text-gray-400 mt-2">
            Sam needs someone to talk to. No matter what it takes, you must make
            him happy by engaging in meaningful conversation. Listen to him,
            understand him, and be there for him.
          </p>
        </div>

        {/* Close Button */}
        <button
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
          onClick={() => setIsOpen(false)}
        >
          Accept the Challenge
        </button>
      </div>
    </div>
  );
}
