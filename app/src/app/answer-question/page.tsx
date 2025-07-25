"use client";
import axios from "axios";
import React, { useState, useEffect, use } from "react";
import { socket } from "@/socket";


const QuizQuestion: React.FC = () => {
      const [showModal, setShowModal] = useState(false);
      const [activeTab, setActiveTab] = useState("chat");
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
            
        if (isStarted) {
          return; // Stop polling if the question has already started.
        }
  
        const intervalId = setInterval(() => socket.emit("is-started"), 2000); // Poll every 2 seconds
  
        return () => clearInterval(intervalId); // Cleanup the interval when the component unmounts or isStarted changes.
      }, [isStarted]);

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

    socket.on("connect", () => {
        console.log("Connected");
    });
    socket.on("question-started", (data: { question: string; options: string; timeLimit: string; }) => {
      console.log("Question started:", data);
      setWaiting(false);
      setQuestion(data.question);
      setOptions(data.options.split(', '));
      setTimeLeft(parseInt(data.timeLimit));
      setIsStarted(true);
      setWaiting(false);
      setIsAnswered(false);
      if (timer) clearInterval(timer);
      const newTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(newTimer);
            // socket.emit("time-left");
            return 0;
          }
          // socket.emit("time-left");
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
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  async function handleSubmit() {
    if (isAnswered) {
      alert("You have already answered this question.");
      return;
    }
    if (selected === null || selected < 0 || selected >= options.length) {
      alert("Please select an option.");
      return;
    }
    const answer = options[selected];
    socket.emit("submit-answer", {name, answer });
    setIsAnswered(true);
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
          <span className="text-xs text-red-500 font-medium">{timeLeft}</span>
        </div>
        <div className="bg-gray-100 rounded-md py-3 px-4 font-medium mb-5">
          {question}
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
      <button
        className="fixed bottom-8 right-8 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
        onClick={() => setShowModal(!showModal)}
        aria-label="Open chat"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.963 7.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    </button>

    {/* Chat Modal */}
    {showModal && (
        <div
            className="fixed bottom-24 right-8 z-50 flex items-end justify-end "
            style={{ pointerEvents: "none" }}
        >
            <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl" // changed max-w-md to max-w-2xl
            style={{ pointerEvents: "auto" }}
            onClick={e => e.stopPropagation()}
            >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b px-6 py-3"> {/* increased px and py */}
                <div className="flex space-x-2">
                <button
                    className={`px-4 py-2 rounded-t ${activeTab === 'chat' ? 'bg-indigo-100 font-semibold' : 'bg-transparent'}`}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
                <button
                    className={`px-4 py-2 rounded-t ${activeTab === 'info' ? 'bg-indigo-100 font-semibold' : 'bg-transparent'}`}
                    onClick={() => setActiveTab('info')}
                >
                    Info
                </button>
                </div>
                <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            {/* Modal Content */}
            <div className="p-8"> {/* increased padding */}
                {activeTab === 'chat' ? (
                <div>
                    {/* Chat content goes here */}
                    <p className="text-gray-600">Chat tab content...</p>
                </div>
                ) : (
                <div>
                    {/* Info content goes here */}
                    <p className="text-gray-600">Info tab content...</p>
                </div>
                )}
            </div>
            </div>
        </div>
        
    )}
    </div>
  );
};

export default QuizQuestion;
