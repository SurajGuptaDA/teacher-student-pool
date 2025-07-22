"use client";
import React, { useState } from "react";

const options = ["Mars", "Venus", "Jupiter", "Saturn"];

const QuizQuestion: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Question Box */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 shadow-lg px-7 py-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-gray-800">Question 1</span>
          <span className="text-xs text-red-500 font-medium">00:15</span>
        </div>
        <div className="bg-gray-100 rounded-md py-3 px-4 font-medium mb-5">
          Which planet is known as the Red Planet?
        </div>
        <div className="space-y-3 mb-6">
          {options.map((opt, idx) => (
            <button
              type="button"
              key={opt}
              onClick={() => setSelected(idx)}
              className={`w-full text-left flex items-center px-4 py-3 border rounded-lg transition
                ${selected === idx ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white"}
                ${selected === idx ? "text-purple-700" : "text-gray-700"}
              `}
            >
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4
                  ${selected === idx ? "bg-purple-600 border-purple-600" : "border-gray-300"}
                `}
              >
                {selected === idx && (
                  <span className="w-3 h-3 rounded-full bg-white block"></span>
                )}
              </span>
              {opt}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-base font-medium py-2 rounded-full transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
