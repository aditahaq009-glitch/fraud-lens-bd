
"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "./components/TopNav";

const examples = [
  "01712345678",
  "suspicious-shop.com",
  "Unknown Facebook seller",
];

const tools = [
  {
    number: "01",
    title: "Scam Analysis",
    description: "Check suspicious messages, links and text for common warning signs.",
    href: "/analysis",
    action: "Analyze a message",
  },
  {
    number: "02",
    title: "Community Registry",
    description: "Explore reported numbers, websites and suspicious online activity.",
    href: "/registry",
    action: "Explore reports",
  },
  {
    number: "03",
    title: "Product vs Reality",
    description: "Compare what an online seller advertised with what you actually received.",
    href: "/product-report",
    action: "Compare a purchase",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] text-[#263d39]">
      <TopNav active="/" />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6949] mb-6">
              Online safety starts with awareness
            </p>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.08]">
              Before you
              <br />
              trust it,
              <br />
              <span className="text-[#bd6949]">check it.</span>
            </h1>

            <p className="text-[#526761] text-lg leading-8 mt-7 max-w-lg">
              Not sure about a phone number, message or online seller?
              Check what others have reported before you make your next move.
            </p>

            <form onSubmit={handleSearch} className="mt-9 max-w-xl">
              <label className="text-sm font-semibold block mb-3">
                What would you like to check?
              </label>

              <div className="flex bg-white border border-[#d9ddd5] focus-within:border-[#17434a]">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Phone number, website or seller..."
                  className="min-w-0 flex-1 px-4 py-4 text-sm outline-none bg-transparent"
                  aria-label="Search suspicious phone number, website or seller"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="bg-[#17434a] text-white px-5 md:px-7 text-sm font-semibold hover:bg-[#24575c] disabled:opacity-40"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[#829089]">Try:</span>
              {examples.map((example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="text-xs text-[#526761] border-b border-[#c9d1c9] hover:text-[#bd6949] hover:border-[#bd6949] pb-1"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE DEMO PANEL */}
          <div className="bg-[#173b43] text-white p-7 md:p-9 relative">
            <div className="flex justify-between items-center border-b border-white/20 pb-5">
              <div>
                <p className="text-xs text-[#d4a18b] uppercase tracking-widest">
                  Fraud Lens BD
                </p>
                <h2 className="text-xl font-semibold mt-2">
                  See how it works
                </h2>
              </div>
              <span className="text-xs border border-white/30 px-3 py-2">
                DEMO
              </span>
            </div>

            <p className="text-sm text-[#d0ddda] mt-7 mb-3">
              Example suspicious message
            </p>

            <div className="bg-white/10 border-l-2 border-[#df926e] p-5">
              <p className="text-sm leading-7 text-[#edf0e9]">
                "Congratulations! You have won a cash prize.
                Verify your account immediately using this link."
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#d0ddda]">
                  Example warning signs
                </span>
                <span className="text-xs text-[#e8ad8e]">
                  Demonstration only
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#e7a17f]" />
                <p className="text-sm">Unexpected prize claim</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#e7a17f]" />
                <p className="text-sm">Urgent account verification</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#e7a17f]" />
                <p className="text-sm">Unverified external link</p>
              </div>
            </div>

            {demoOpen && (
              <div className="mt-6 border-t border-white/20 pt-5">
                <p className="text-sm font-semibold text-[#e8ad8e]">
                  Why should you be cautious?
                </p>
                <p className="text-sm text-[#d0ddda] leading-7 mt-2">
                  Unexpected rewards, pressure to act quickly and requests
                  to verify accounts through unknown links are common
                  phishing warning signs.
                </p>
                <Link
                  href="/analysis"
                  className="inline-block mt-4 text-sm font-semibold text-white underline underline-offset-4"
                >
                  Try scam analysis →
                </Link>
              </div>
            )}

            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className="mt-7 w-full border border-white/40 py-3 text-sm font-semibold hover:bg-white hover:text-[#173b43] transition-colors"
            >
              {demoOpen ? "Hide explanation ↑" : "See why this is suspicious →"}
            </button>

            <p className="text-[10px] text-[#aebfba] mt-4">
              Illustrative example. This is not a live detection result.
            </p>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="bg-[#f0f1eb] border-y border-[#e0e3d9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#bd6949] font-bold mb-3">
                Explore the platform
              </p>
              <h2 className="text-3xl font-semibold">
                Tools to help you stay informed.
              </h2>
            </div>
            <p className="text-base text-[#526761] max-w-sm leading-7">
              From checking suspicious messages to sharing your experience,
              find the right tool for the situation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link
                href={tool.href}
                key={tool.number}
                className="group border-t-2 border-[#17434a] pt-6 hover:border-[#bd6949] transition-colors"
              >
                <p className="text-xs text-[#bd6949] font-bold mb-6">
                  {tool.number}
                </p>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#bd6949]">
                  {tool.title}
                </h3>
                <p className="text-base text-[#526761] leading-8 min-h-20">
                  {tool.description}
                </p>
                <p className="text-sm font-semibold mt-5 text-[#17434a] group-hover:text-[#bd6949]">
                  {tool.action} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[#bd6949] font-bold mb-3">
          Simple steps
        </p>
        <h2 className="text-3xl font-semibold mb-12">
          From suspicion to awareness.
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            ["01", "Search", "Look up a suspicious number, website or seller."],
            ["02", "Understand", "Review reported incidents and possible warning signs."],
            ["03", "Contribute", "Share your experience and help others stay alert."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-5">
              <span className="text-2xl font-semibold text-[#bd6949]">
                {number}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-base text-[#526761] leading-8">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY CALL TO ACTION */}
      <section className="bg-[#173b43] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row justify-between md:items-center gap-8">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#e4a184] mb-4">
              Your experience matters
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              One shared report could help someone avoid a scam.
            </h2>
            <p className="text-base text-[#e3ebe8] mt-4 leading-8">
              Help build awareness by sharing suspicious activity and
              online shopping experiences.
            </p>
          </div>

          <Link
            href="/report"
            className="inline-block border border-white px-7 py-4 text-sm font-semibold hover:bg-white hover:text-[#173b43] transition-colors"
          >
            Report a scam →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e4e5dd]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="font-bold">
                FRAUD LENS <span className="text-[#bd6949]">BD</span>
              </p>
              <p className="text-sm text-[#68776f] mt-2">
                Community intelligence for safer online decisions.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-[#526761]">
              <Link href="/search">Search</Link>
              <Link href="/registry">Registry</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/report">Report</Link>
              <Link href="/login">Log in</Link>
              <Link href="/signup">Sign up</Link>
            </div>
          </div>

          <div className="border-t border-[#e4e5dd] mt-7 pt-5 flex justify-between text-xs text-[#829089]">
            <span>Fraud Lens BD · Bangladesh</span>
            <span>Think before you trust.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
