// src/app/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/crew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: input }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      // Redirect to result page with report as a URL param
      router.push(`/result?report=${encodeURIComponent(data.report)}`);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
          Career Guide AI
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
             p-4 rounded-xl shadow-sm resize-none transition duration-200
             text-gray-900 placeholder-gray-400 bg-white"
            placeholder="💡 Tell us about your interests,skills,background,goals,etc..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-md ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Analyzing..." : "✨ Get Career Guide"}
          </button>
        </form>
      </div>
    </main>
  );
}
