
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error("Search service unavailable.");

      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch {
      setError("We couldn't complete your search. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] text-[#263d39]">

      {/* Header */}
      <header className="border-b border-[#e6e4db]">
        <nav className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#17434a] text-white font-bold text-lg px-3 py-2 rounded-lg">
              FL
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">
                Fraud Lens BD
              </p>
              <p className="text-[11px] text-[#78827a]">
                Think before you trust.
              </p>
            </div>
          </Link>

          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="font-semibold text-[#bd6949]">
              Home
            </Link>
            <Link href="/search" className="hover:text-[#bd6949]">
              Search
            </Link>
            <Link href="/report" className="hover:text-[#bd6949]">
              Report
            </Link>
            <Link href="/analysis" className="hover:text-[#bd6949]">
              Analyze
            </Link>
            <Link href="/login" className="hover:text-[#bd6949]">
              Login
            </Link>
          </div>

        </nav>
      </header>

      {/* Introduction */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-10">

        <p className="text-xs font-semibold tracking-widest text-[#bd6949] mb-5">
          ONLINE SCAM AWARENESS · BANGLADESH
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight max-w-2xl">
          Before you trust it,
          <span className="block text-[#bd6949]">
            check it.
          </span>
        </h1>

        <p className="text-[#6d7971] text-sm md:text-base leading-7 mt-5 max-w-xl">
          Received a suspicious call, message or payment request?
          Search it, report it and help others stay informed.
        </p>

      </section>

      {/* Search */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-12">

        <div className="max-w-3xl">

          <h2 className="text-lg font-semibold mb-3">
            Search the scam registry
          </h2>

          <form onSubmit={handleSearch} className="flex gap-2">

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Phone number, website or suspicious account..."
              className="min-w-0 flex-1 bg-white border border-[#dedfd5] rounded-lg px-4 py-4 text-sm outline-none focus:border-[#bd6949]"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-[#17434a] text-white px-5 md:px-7 rounded-lg text-sm font-semibold hover:bg-[#24575c] disabled:opacity-50"
            >
              {loading ? "Checking..." : "Search"}
            </button>

          </form>

          <p className="text-xs text-[#8a918a] mt-3">
            Search reported phone numbers, domains and scam categories.
          </p>

          {/* Search results */}
          {error && (
            <p className="text-sm text-red-700 mt-4">{error}</p>
          )}

          {!loading && results.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">
                Search results ({results.length})
              </p>

              {results.map((item) => (
                <div
                  key={item.id}
                  className="border-t border-[#dedfd5] py-4"
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold text-sm break-all">
                      {item.query}
                    </p>
                    <span className="text-xs text-[#bd6949] shrink-0">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#78827a] mt-2">
                    {item.category}
                  </p>

                  <p className="text-sm text-[#59675f] mt-2">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && !error && (
            <p className="text-sm text-[#78827a] mt-5">
              No matching records found.
            </p>
          )}

        </div>
      </section>

      {/* Main actions */}
      <section className="bg-[#f0f0e8] border-y border-[#e3e3d9]">

        <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">

          <h2 className="text-xl font-semibold mb-7">
            How can we help you?
          </h2>

          <div className="max-w-3xl">

            <Link
              href="/report"
              className="flex items-center gap-4 py-5 border-t border-[#d9dbd0] group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#f6e6d8] flex items-center justify-center text-[#bd6949] text-xl">
                +
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-[#bd6949]">
                  Report a scam
                </h3>
                <p className="text-xs text-[#78827a] mt-1">
                  Share an incident and supporting evidence.
                </p>
              </div>

              <span className="text-[#bd6949] text-xl">→</span>
            </Link>

            <Link
              href="/analysis"
              className="flex items-center gap-4 py-5 border-t border-[#d9dbd0] group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#e2ece5] flex items-center justify-center text-[#34715b] text-lg">
                ◉
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-[#bd6949]">
                  Analyze suspicious content
                </h3>
                <p className="text-xs text-[#78827a] mt-1">
                  Examine suspicious messages and links.
                </p>
              </div>

              <span className="text-[#bd6949] text-xl">→</span>
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-4 py-5 border-y border-[#d9dbd0] group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#f3edcf] flex items-center justify-center text-[#987b29] text-lg">
                ↗
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm group-hover:text-[#bd6949]">
                  Explore community reports
                </h3>
                <p className="text-xs text-[#78827a] mt-1">
                  Look up previously reported suspicious activity.
                </p>
              </div>

              <span className="text-[#bd6949] text-xl">→</span>
            </Link>

          </div>
        </div>
      </section>

      {/* Trust information */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-12">

        <h2 className="font-semibold text-lg">
          Stay informed. Stay cautious.
        </h2>

        <p className="text-sm text-[#78827a] leading-7 mt-3 max-w-2xl">
          Community reports are submitted by users and are not automatically
          verified. Always check information carefully before making
          financial decisions.
        </p>

        <div className="mt-7 text-xs text-[#78827a] flex flex-wrap gap-3 items-center">
          <span className="w-2 h-2 rounded-full bg-[#4d9870]" />
          Backend: {backendStatus === "connected"
            ? "Connected"
            : backendStatus === "offline"
            ? "Unavailable"
            : "Checking"}
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-[#e6e4db]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 text-xs text-[#78827a] flex flex-wrap justify-between gap-3">
          <span>Fraud Lens BD · Bangladesh</span>
          <span>Think before you trust.</span>
        </div>
      </footer>

    </main>
  );
}
