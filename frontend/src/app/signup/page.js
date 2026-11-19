
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopNav from "../components/TopNav";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data.detail === "string"
            ? data.detail
            : "Please check your registration details."
        );
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] text-[#263d39]">
      <TopNav active="/signup" />

      <section className="max-w-md mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[#bd6949] font-semibold mb-4">
          Join the community
        </p>

        <h1 className="text-4xl font-semibold mb-3">
          Create an account
        </h1>

        <p className="text-base text-[#526761] leading-7 mb-8">
          Join Fraud Lens BD to share reports and help others stay informed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              maxLength={150}
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-white border border-[#d9ddd5] rounded-md px-4 py-3 outline-none focus:border-[#17434a] focus:ring-1 focus:ring-[#17434a]"
            />
          </div>

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
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-white border border-[#d9ddd5] rounded-md px-4 py-3 outline-none focus:border-[#17434a] focus:ring-1 focus:ring-[#17434a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17434a] text-white py-3 rounded-md font-semibold hover:bg-[#24575c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#bd6949] hover:underline"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
