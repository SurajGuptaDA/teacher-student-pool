"use client";
import Image from "next/image";
import React from "react";

export default function Home() {
  const [selectedRole, setSelectedRole] = React.useState("student");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="mb-8 mt-4">
        <button className="bg-blue-200 text-blue-700 px-4 py-1 rounded-full text-xs font-medium">
          Intervue Poll
        </button>
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">
        Welcome to the <span className="font-bold">Live Polling System</span>
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Please select the role that best describes you to begin using the live polling system
      </p>
      <div className="flex gap-4 mb-8">
        <div
          className={`border-2 rounded-lg px-6 py-4 w-56 cursor-pointer ${
        selectedRole === "student"
          ? "border-blue-400"
          : "border-gray-200"
          }`}
          onClick={() => setSelectedRole("student")}
        >
          <h2 className="font-semibold mb-2">I’m a Student</h2>
          <p className="text-sm text-gray-400">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </div>
        <div
          className={`border-2 rounded-lg px-6 py-4 w-56 cursor-pointer ${
        selectedRole === "teacher"
          ? "border-blue-400"
          : "border-gray-200"
          }`}
          onClick={() => setSelectedRole("teacher")}
        >
          <h2 className="font-semibold mb-2">I’m a Teacher</h2>
          <p className="text-sm text-gray-400">
        Submit answers and view live poll results in real-time.
          </p>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2 rounded-full font-medium">
        Continue
      </button>
    </div>
  );
}
