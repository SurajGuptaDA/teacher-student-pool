"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const PollPage: React.FC = () => {
    const [question, setQuestion] = useState("");
    const [timeLimit, setTimeLimit] = useState("60");
    const [options, setOptions] = useState<{ id: number; value: string; answer: "yes" | "no" }[]>([]);
    const router = useRouter();

        const handleAddOption = () => {
            setOptions((prev) => [
                ...prev,
                { id: Date.now(), value: "", answer: "no" }
            ]);
        };

        const handleOptionChange = (id: number, value: string) => {
            setOptions((prev) =>
                prev.map((opt) =>
                    opt.id === id ? { ...opt, value } : opt
                )
            );
        };

        const handleAnswerChange = (id: number, answer: "yes" | "no") => {
            setOptions((prev) =>
                prev.map((opt) =>
                    opt.id === id ? { ...opt, answer } : opt
                )
            );
        };
        const handleSubmit = async () => {
            if (!question || options.length === 0) {
                alert("Please enter a question and at least one option.");
                return;
            }
            console.log(question, options.map(opt => ({ value: opt.value, answer: opt.answer })), timeLimit);  
            const response = await axios.post("/api/create-question", 
                JSON.stringify({
                    question,
                    options: options.map(opt => ({ value: opt.value, answer: opt.answer })),
                    timeLimit,
                })
            );
            console.log(response.data);
            if (response.status === 200) {
                alert("Question created successfully!");
                setQuestion("");
                setOptions([]);
                setTimeLimit("60 seconds");
                router.push("/ask-question");
            } else {
                alert("Failed to create question. Please try again.");
            }
        }
  return (
    
    <div className="min-h-screen flex flex-col pl-30 justify-center bg-white">
        
      {/* Top Poll Label */}
      <div className="mb-5 mt-8">
        <button className="bg-blue-200 text-blue-700 px-4 py-1 rounded-full text-xs font-medium">Intervue Poll</button>
      </div>

      {/* Main Heading & Subheading */}
      <h1 className="text-3xl font-semibold mb-1">Let’s <span className="font-bold">Get Started</span></h1>
      <p className="text-gray-500 text-sm mb-7 max-w-md">
        you’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time.
      </p>

      {/* Question Enter Area */}
      <div className="w-full max-w-xl rounded-lg mb-8">
        <div className="flex items-center justify-between mb-5">
          <label htmlFor="question" className="block text-gray-700 font-medium">
            Enter your question
          </label>
          <select
            className="ml-3 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Select time limit" 
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          >
            <option value={60}>60 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={15}>15 seconds</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="items-center mb-2 bg-gray-50 border border-gray-200 rounded-md">
          <textarea
            id="question"
            placeholder="Type your question..."
            className="flex-1 rounded-md p-3 text-gray-900 resize-y min-h-[48px] max-h-40 focus:outline-none font-bold w-140"
            rows={2} 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="text-gray-400 text-right text-xs p-1">0/100</div>
        </div>
        
      </div>

      {/* Options Edit Area */}
      <div className="w-full max-w-xl mb-8">
            <div>
                {options.map((option, idx) => (
                    <div key={option.id} className="flex items-center mb-3">
                        <input
                            type="text"
                            className="border rounded px-2 py-1 mr-4 flex-1"
                            placeholder={`Option ${idx + 1}`}
                            value={option.value}
                            onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        />
                        <label className="mr-2 flex items-center">
                            <input
                                type="radio"
                                name={`answer-${option.id}`}
                                checked={option.answer === "yes"}
                                onChange={() => handleAnswerChange(option.id, "yes")}
                                className="mr-1"
                            />
                            Yes
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name={`answer-${option.id}`}
                                checked={option.answer === "no"}
                                onChange={() => handleAnswerChange(option.id, "no")}
                                className="mr-1"
                            />
                            No
                        </label>
                    </div>
                ))}
                <button
                    type="button"
                    className=" px-4 border py-1 rounded text-[#7765DA] text-md font-medium hover:bg-gray-300"
                    onClick={handleAddOption}
                >
                    Add More Option
                </button>
            </div>
      </div>

      {/* Bottom Button */}
        <div className="fixed bottom-8 right-8 z-50">
            <button onClick={handleSubmit} className="w-[140px] py-2 rounded-full bg-indigo-500 text-white font-medium text-lg hover:bg-indigo-600 transition shadow-lg">
                Ask Question
            </button>
        </div>
        {/* <button className="w-[140px] py-2 rounded-full bg-indigo-500 text-white font-medium text-lg hover:bg-indigo-600 transition mb-10">Ask Question</button> */}
    </div>
  );
};

export default PollPage;
