"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";
import ResultCard from "../components/ResultCard";
import { SAMPLE_REGISTRY } from "../components/sampleData";

const API_URL = "http://127.0.0.1:8000";

// Turn a report from GET /reports into the same shape the search results use
function toEntry(report) {
  return {
    id: report.id,
    query: report.suspicious_identifier || "No identifier provided",
    category: report.scam_type,
    status: report.status,
    details: report.description,
    source: "community",
    platform: report.platform,
    amount_bdt: report.amount_bdt,
    incident_date: report.incident_date,
    reported_at: report.created_at,
  };
}

export default function RegistryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      try {
        const res = await fetch(`${API_URL}/reports`);
        if (!res.ok) throw new Error("Could not load reports.");
        const data = await res.json();
        if (!ignore) {
          setReports(
            Array.isArray(data.reports) ? data.reports.map(toEntry) : []
          );
        }
      } catch {
        if (!ignore) {
          setError(
            "We couldn't load the registry. Please check that the backend is running."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadReports();
    return () => {
      ignore = true;
    };
  }, []);

  const usingSample = !loading && !error && reports.length === 0;
  const entries = usingSample ? SAMPLE_REGISTRY : reports;

  const categories = ["All", ...new Set(entries.map((e) => e.category))];

  const needle = filterText.trim().toLowerCase();
  const visible = entries.filter((e) => {
    if (category !== "All" && e.category !== category) return false;
    if (!needle) return true;
    return (
      e.query.toLowerCase().includes(needle) ||
      (e.details || "").toLowerCase().includes(needle)
    );
  });

  return (
    <main className="min-h-screen bg-[#f3f2ec] text-[#172b35]">
      <TopNav active="/registry" />

      <section className="max-w-4xl mx-auto px-6 md:px-12 pt-14 pb-20">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-[#d76b42]" />
          <p className="text-xs font-bold tracking-[3px] text-[#71817d]">
            PUBLIC SCAM REGISTRY
          </p>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-2px] leading-[1.05]">
          Community
          <span className="text-[#d76b42] italic font-normal"> reports.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
          Browse incidents reported by people in Bangladesh. Reports start as
          unverified and are not proof of fraud.
        </p>

        {loading && (
          <p className="mt-8 text-sm text-[#66766f]">Loading reports...</p>
        )}

        {error && (
          <div className="mt-8 p-4 bg-[#fbeae4] border border-[#efc9bb] text-[#a63d1f] text-sm">
            {error}
          </div>
        )}

        {usingSample && (
          <div className="mt-8 p-4 bg-[#e6e9f2] border border-[#cdd3e6] text-[#3b4a7a] text-sm">
            No community reports yet. The entries below are SAMPLE DATA for
            demonstration.{" "}
            <Link href="/report" className="font-semibold underline">
              Be the first to report
            </Link>
            .
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by number, page or keyword..."
                className="min-w-0 flex-1 bg-white border border-[#dce1da] p-4 text-sm outline-none focus:border-[#d76b42]"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-[#dce1da] p-4 text-sm outline-none focus:border-[#d76b42]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All categories" : c}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm font-semibold mt-6 mb-4">
              Showing {visible.length} of {entries.length} entries
            </p>

            <div className="space-y-4">
              {visible.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}

              {visible.length === 0 && (
                <div className="bg-white border border-[#e0e3dc] p-6 text-sm text-[#66766f]">
                  No entries match your filter.
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}