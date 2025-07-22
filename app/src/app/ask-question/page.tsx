"use client";
import { useState } from "react";
import React from "react";



const ResultsPage: React.FC = () => {
    const [pollResults] = useState<{ option: string; percent: number }[]>([
        { option: "Mars", percent: 75 },
        { option: "Venus", percent: 5 },
        { option: "Jupiter", percent: 5 },
        { option: "Saturn", percent: 15 },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
  return (
    <div className="min-h-screen flex flex-col justify-center bg-white">
      {/* View Poll History Button */}
      <button className="absolute top-10 right-12 bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 py-1 rounded-full font-medium text-xs">
        View Poll history
      </button>

      {/* Poll Card */}
    
      <div className="w-[800px] mx-auto flex flex-col items-stretch px-0 py-0">
        <div className="mb-6 text-2xl font-bold text-gray-800">
            <span>Question</span>
        </div>
        <div className="bg-gray-200 rounded-t-xl px-6 py-2 font-medium text-left">
          Which planet is known as the Red Planet?*
        </div>
        <div className="bg-white p-6 space-y-3">
          {pollResults.map((o, i) => (
            <div className="flex items-center" key={o.option}>
              {/* Option Label */}
              <div className="flex-1">
                <div className="text-sm text-gray-700">{o.option}</div>
                {/* Progress bar */}
                <div className="w-full h-4 mt-1 bg-gray-100 rounded">
                  <div
                    className="h-4 rounded bg-indigo-400 transition-all duration-300"
                    style={{ width: `${o.percent}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-gray-500 text-xs ml-2 w-9 text-right">
                {o.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Question Button */}
    <div className="flex justify-center pl-150">
        <button className="mt-8 bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-2 rounded-full text-base font-medium">
            + Ask a new question
        </button>
    </div>
    {/* Chat Icon Button */}
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

export default ResultsPage;
