"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NameEntry() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    const res = await axios.post("/api/login-user", { name, role: "student" });
    if (res.status === 200) {
      router.push("/answer-question");
    } else {
      alert("Failed to login as student");
      console.error("Error logging in as student:", res.data.error);
      return;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Top Label */}
      <button className="bg-blue-200 text-blue-700 px-4 py-1 rounded-full text-xs font-medium mb-6">
        Intervue Poll
      </button>

      {/* Heading and Subheading */}
      <h1 className="text-3xl font-semibold text-center mb-2">
        Let’s <span className="font-bold">Get Started</span>
      </h1>
      <p className="text-gray-500 text-center text-sm mb-8 max-w-sm">
        If you’re a student, you’ll be able to <span className="font-semibold">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
      </p>

      {/* Name Input Field */}
      <div className="w-full flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter your Name"
          className="w-80 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Continue Button */}
      <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-medium px-10 py-2 rounded-full transition"
        onClick={handleSubmit}
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
};
