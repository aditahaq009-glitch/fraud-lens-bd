
"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage(
      "Login preview complete! Account authentication will be available in the full release."
    );
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
              placeholder="Enter your password"
              className="w-full bg-white border border-[#d9ddd5] rounded-md px-4 py-3 outline-none focus:border-[#17434a] focus:ring-1 focus:ring-[#17434a]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#17434a] text-white py-3 rounded-md font-semibold hover:bg-[#24575c] transition-colors"
          >
            Log in
          </button>
        </form>

        {message && (
          <div
            role="status"
            className="mt-6 border-l-4 border-[#bd6949] bg-[#f2f0e9] p-4"
          >
            <p className="text-sm font-semibold text-[#263d39] mb-1">
              Login preview
            </p>
            <p className="text-sm text-[#526761] leading-6">
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

        <p className="mt-8 text-xs text-[#68776f]">
          Demo environment · Authentication is not connected yet.
        </p>
      </section>
    </main>
  );
}
