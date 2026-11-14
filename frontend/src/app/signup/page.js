
"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";

export default function SignupPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage(
      "Thanks for your interest! Account registration will be available in the full release."
    );
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
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full bg-white border border-[#d9ddd5] rounded-md px-4 py-3 outline-none focus:border-[#17434a] focus:ring-1 focus:ring-[#17434a]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#17434a] text-white py-3 rounded-md font-semibold hover:bg-[#24575c] transition-colors"
          >
            Create account
          </button>
        </form>

        {message && (
          <div
            role="status"
            className="mt-6 border-l-4 border-[#bd6949] bg-[#f2f0e9] p-4"
          >
            <p className="text-sm font-semibold text-[#263d39] mb-1">
              Registration preview
            </p>
            <p className="text-sm text-[#526761] leading-6">
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

        <p className="mt-8 text-xs text-[#68776f]">
          Demo environment · Registration is not connected yet.
        </p>
      </section>
    </main>
  );
}
