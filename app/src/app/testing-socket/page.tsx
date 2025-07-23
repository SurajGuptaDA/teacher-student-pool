"use client";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("message", (msg: string) =>
      setMessages((prev) => [...prev, msg])
    );
    return () => socket.off("message");
  }, []);

  return (
    <div>
      <ul className="text-green">
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault();
        socket.emit("message", input);
        setInput("");
      }} aria-label="Send message form">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message" aria-label="Message input" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
