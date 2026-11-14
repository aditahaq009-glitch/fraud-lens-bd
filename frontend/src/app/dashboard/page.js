"use client";

import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import { SAMPLE_MONTHLY, SAMPLE_PLATFORMS } from "../components/sampleData";

const API_URL = "http://127.0.0.1:8000";

function countBy(list, key) {
  const counts = {};
  for (const item of list) {
    const value = item[key] || "Unknown";
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-[#e0e3dc] p-5">
      <p className="text-[10px] tracking-[2px] font-bold text-[#87948b]">
        {label}
      </p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}

function BarList({ rows }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex justify-between text-xs mb-1">
            <span>{row.label}</span>
            <span className="font-semibold">{row.value}</span>
          </div>
          <div className="h-2 bg-[#e9ebe6]">
            <div
              className="h-2 bg-[#173b43]"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SampleTag() {
  return (
    <span className="text-[10px] tracking-[2px] font-bold bg-[#e6e9f2] text-[#3b4a7a] px-2 py-1">
      SAMPLE DATA
    </span>
  );
}

export default function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      try {
        const res = await fetch(`${API_URL}/reports`);
        if (!res.ok) throw new Error("Could not load reports.");
        const data = await res.json();
        if (!ignore) {
          setReports(Array.isArray(data.reports) ? data.reports : []);
        }
      } catch {
        if (!ignore) {
          setError(
            "We couldn't load live statistics. Please check that the backend is running."
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

  const unverified = reports.filter(
    (r) => (r.status || "").toLowerCase() === "unverified"
  ).length;
  const totalLoss = reports.reduce((sum, r) => sum + (r.amount_bdt || 0), 0);
  const byCategory = countBy(reports, "scam_type");
  const maxMonth = Math.max(...SAMPLE_MONTHLY.map((m) => m.value), 1);

  return (
    <main className="min-h-screen bg-[#f3f2ec] text-[#172b35]">
      <TopNav active="/dashboard" />

      <section className="max-w-5xl mx-auto px-6 md:px-12 pt-14 pb-20">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-[#d76b42]" />
          <p className="text-xs font-bold tracking-[3px] text-[#71817d]">
            TRENDS DASHBOARD
          </p>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-2px] leading-[1.05]">
          Scam
          <span className="text-[#d76b42] italic font-normal"> trends.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
          A quick look at what the community is reporting. Live numbers come
          from submitted reports. Trend charts use sample data until enough
          real reports exist.
        </p>

        {/* Live section */}
        <div className="mt-10 flex items-center gap-3">
          <h2 className="text-xl font-semibold">Live from submitted reports</h2>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-[#66766f]">Loading statistics...</p>
        )}

        {error && (
          <div className="mt-4 p-4 bg-[#fbeae4] border border-[#efc9bb] text-[#a63d1f] text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <StatCard label="TOTAL REPORTS" value={reports.length} />
              <StatCard label="UNVERIFIED" value={unverified} />
              <StatCard
                label="REPORTED LOSS (BDT)"
                value={totalLoss.toLocaleString("en-US")}
              />
              <StatCard label="CATEGORIES" value={byCategory.length} />
            </div>

            <div className="bg-white border border-[#e0e3dc] p-6 mt-4">
              <h3 className="font-semibold mb-5">Reports by category</h3>
              {byCategory.length > 0 ? (
                <BarList rows={byCategory} />
              ) : (
                <p className="text-sm text-[#66766f]">
                  No reports yet. Submit one from the Report page to see it
                  here.
                </p>
              )}
            </div>
          </>
        )}

        {/* Sample section */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold">Trends</h2>
          <SampleTag />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="bg-white border border-[#e0e3dc] p-6">
            <h3 className="font-semibold mb-5">Reports per month</h3>
            <div className="flex items-end gap-3 h-44">
              {SAMPLE_MONTHLY.map((m) => (
                <div
                  key={m.label}
                  className="flex-1 flex flex-col justify-end items-center h-full"
                >
                  <span className="text-xs font-semibold mb-1">{m.value}</span>
                  <div
                    className="w-full bg-[#d76b42]"
                    style={{ height: `${(m.value / maxMonth) * 100}%` }}
                  />
                  <span className="text-[10px] text-[#71817d] mt-2">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e0e3dc] p-6">
            <h3 className="font-semibold mb-5">Most reported platforms</h3>
            <BarList rows={SAMPLE_PLATFORMS} />
          </div>
        </div>

        <p className="mt-10 text-xs text-[#87948b] leading-6">
          Sample data is made up for demonstration only. Community reports are
          unverified and are not proof of fraud.
        </p>
      </section>
    </main>
  );
}