"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      // Ensure results is always an array
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Universal Search Registry</h1>
          <p className="text-gray-600">Search reported phone numbers, domains, or scam types.</p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number, domain, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{item.query}</span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Category: {item.category}</p>
                <p className="text-sm text-gray-700">{item.details}</p>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-gray-500 py-4">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}