"use client";
import axios from "axios";
import React, { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";

let socket: typeof Socket;

const QuizQuestion: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);
  const [waiting, setWaiting] = useState<boolean>(true);
  const [options, setOptions] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const res =  axios.get("/api/getName");
    res.then((response) => {
      setName(response.data.name);
    }).catch((error) => {
      console.error("Error fetching name:", error);
      setName("Student");
    });
  }, []);

  useEffect(() => {
    fetch("/api/questionStream");
    socket = io();
    socket.on("connect", () => {
        console.log("Connected");
    });
    socket.on("question-started", (data: { question: string; options: string; timeLimit: string; }) => {
      setWaiting(false);
      setQuestion(data.question);
      setOptions(data.options.split(","));
      setTimeLeft(parseInt(data.timeLimit));
      setIsStarted(true);
      setWaiting(false);
      setIsAnswered(false);
      if (timer) clearInterval(timer);
      const newTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(newTimer);
            socket.emit("time-left");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(newTimer);
    });
    socket.on("time-up", () => {
      if (timer) clearInterval(timer);
      setWaiting(true);
      setIsStarted(false);
      setIsAnswered(false);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  async function handleSubmit() {
    if (selected === null || selected < 0 || selected >= options.length) {
      alert("Please select an option.");
      return;
    }
    const answer = options[selected];
    socket.emit("submit-answer", {name, answer });
    setIsAnswered(true);
    setWaiting(true);
    if (timer) clearInterval(timer);
  }





  return (
    (waiting && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Intervue Poll Button */}
      <button className="bg-blue-200 text-blue-700 px-4 py-1 rounded-full text-xs font-medium mb-7">
        Intervue Poll
      </button>

      {/* Loader Animation */}
      <div className="mb-5">
        <span className="block w-14 h-14 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
      </div>

      {/* Waiting Message */}
      <p className="text-xl font-semibold text-center mb-2">
        Wait for the teacher to ask questions..
      </p>
    </div>
    )) ||
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Question Box */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 shadow-lg px-7 py-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-gray-800">Question</span>
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
          onClick={handleSubmit}
          disabled={isAnswered}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
