"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend connection failed"));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Fraud Lens BD</h1>
      <p className="mt-4">{message}</p>
    </main>
  );
}