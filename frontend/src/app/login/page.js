
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopNav from "../components/TopNav";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : "Login failed. Please try again."
        );
        return;
      }

      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] text-[#263d39]">
      <TopNav active="/login" />

      <section className="max-w-md mx-auto px-6 py-16 md:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-[#bd6949] font-semibold mb-4">
          Welcome back
        </p>

        <h1 className="text-4xl font-semibold mb-3">
          Log in to your account
        </h1>

        <p className="text-base text-[#526761] leading-7 mb-9">
          Access your reports and stay connected with the community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white border border-[#d9ddd5] rounded-md px-4 py-3 outline-none focus:border-[#17434a] focus:ring-1 focus:ring-[#17434a]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              maxLength={128}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white border border-[#d9ddd5] rounded-md px-4 py-3 outline-none focus:border-[#17434a] focus:ring-1 focus:ring-[#17434a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17434a] text-white py-3 rounded-md font-semibold hover:bg-[#24575c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {message && (
          <div
            role="alert"
            className="mt-6 border-l-4 border-red-500 bg-red-50 p-4"
          >
            <p className="text-sm text-red-700 leading-6">
              {message}
            </p>
          </div>
        )}

        <p className="mt-8 text-sm text-[#526761]">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#bd6949] hover:underline">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
