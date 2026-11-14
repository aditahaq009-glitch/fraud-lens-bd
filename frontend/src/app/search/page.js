"use client";

import { useState } from "react";
import TopNav from "../components/TopNav";
import ResultCard from "../components/ResultCard";

const API_URL = "http://127.0.0.1:8000";

// Quick examples so the demo is fast (these match the demo records)
const EXAMPLES = ["01700000000", "+8801700000000", "fake-lottery.com"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchedFor, setSearchedFor] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dbWarning, setDbWarning] = useState(false);

  async function runSearch(text) {
    const term = text.trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setDbWarning(false);

    try {
      const res = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(term)}`
      );

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
      setDbWarning(data.database_available === false);
      setSearchedFor(term);
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to reach the search server. Please try again later.");
      setResults([]);
      setSearchedFor("");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    runSearch(query);
  }

  function pickExample(example) {
    setQuery(example);
    runSearch(example);
  }

  return (
    <main className="min-h-screen bg-[#f3f2ec] text-[#172b35]">
      <TopNav active="/search" />

      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-14 pb-20">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-[#d76b42]" />
          <p className="text-xs font-bold tracking-[3px] text-[#71817d]">
            UNIVERSAL SEARCH
          </p>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-2px] leading-[1.05]">
          Check before
          <span className="text-[#d76b42] italic font-normal"> you pay.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
          Search a phone number, website, seller or page name, or a scam
          category. Phone numbers work in any format, like 017-0000 0000 or
          +8801700000000.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mt-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter phone number, domain, seller or category..."
            className="min-w-0 flex-1 bg-white border border-[#dce1da] p-4 text-sm outline-none focus:border-[#d76b42]"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-[#173b43] text-white px-7 text-sm font-semibold hover:bg-[#24545b] transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-[#71817d]">
          <span>Try an example:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => pickExample(example)}
              className="border border-[#cbd3c9] px-3 py-1 hover:border-[#d76b42] hover:text-[#d76b42]"
            >
              {example}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-[#fbeae4] border border-[#efc9bb] text-[#a63d1f] text-sm">
            {error}
          </div>
        )}

        {dbWarning && !error && (
          <div className="mt-6 p-4 bg-[#fbf3de] border border-[#efdcae] text-[#8a6212] text-sm">
            Community reports are temporarily unavailable. Only demo records
            are shown.
          </div>
        )}

        {!error && !loading && searchedFor && (
          <div className="mt-8 space-y-4">
            <p className="text-sm font-semibold">
              {results.length} result{results.length === 1 ? "" : "s"} for
              “{searchedFor}”
            </p>

            {results.map((item) => (
              <ResultCard key={item.id} item={item} />
            ))}

            {results.length === 0 && (
              <div className="bg-white border border-[#e0e3dc] p-6 text-sm text-[#66766f] leading-7">
                No records found. This does not mean it is safe. It only means
                nobody has reported it here yet. Stay careful, and consider
                using the Analyze page to check a suspicious message.
              </div>
            )}
          </div>
        )}

        <p className="mt-10 text-xs text-[#87948b] leading-6">
          Community reports are submitted by users and are not automatically
          verified. A report is not proof that someone is a fraudster.
        </p>
      </section>
    </main>
  );
}