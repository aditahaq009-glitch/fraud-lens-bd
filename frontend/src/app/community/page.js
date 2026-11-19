
"use client";

import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";

const API = "http://127.0.0.1:8000";

export default function CommunityPage() {
  const [reports, setReports] = useState([]);
  const [votes, setVotes] = useState({});
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);

  async function loadVotes(reportId) {
    const response = await fetch(
      `${API}/reports/${reportId}/votes`
    );

    if (!response.ok) return;

    const data = await response.json();

    setVotes((previous) => ({
      ...previous,
      [reportId]: data,
    }));
  }

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch(`${API}/reports`);

        if (!response.ok) {
          throw new Error("Could not load reports.");
        }

        const data = await response.json();

        setReports(data.reports);

        await Promise.all(
          data.reports.map((report) => loadVotes(report.id))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  async function submitVote(reportId, voteType) {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setPending(reportId);

    try {
      const response = await fetch(
        `${API}/reports/${reportId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vote_type: voteType,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Voting failed."
        );
      }

      setMessages((previous) => ({
        ...previous,
        [reportId]: {
          text: "Your vote has been recorded.",
          success: true,
        },
      }));

      await loadVotes(reportId);
    } catch (err) {
      setMessages((previous) => ({
        ...previous,
        [reportId]: {
          text: err.message,
          success: false,
        },
      }));
    } finally {
      setPending(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f2ec] text-[#172b35]">
      <TopNav active="/community" />

      {/* Page introduction */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pt-14 pb-9">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-[#d76b42]" />
          <p className="text-xs font-bold tracking-[3px] text-[#71817d]">
            COMMUNITY VERIFICATION / 002
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-[-3px] leading-[1.05]">
              Every voice
              <br />
              <span className="text-[#d76b42] italic font-normal">
                builds trust.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
              Review reported incidents and help build a
              safer, more accountable digital community.
            </p>
          </div>

          <div className="md:text-right pb-2">
            <p className="text-xs tracking-widest text-[#87948b]">
              COMMUNITY INCIDENTS
            </p>
            <p className="text-3xl font-semibold mt-1">
              {loading ? "—" : reports.length}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-20">

        {/* Trust and safety notice */}
        <div className="bg-[#e9e8df] border border-[#d9ddd5] p-6 mb-8">
          <p className="text-[10px] tracking-[2px] font-bold text-[#d76b42]">
            IMPORTANT / TRUST & SAFETY
          </p>

          <h2 className="text-xl font-semibold mt-2">
            A report isn't a verdict.
          </h2>

          <p className="text-xs text-[#69776e] leading-6 mt-2">
            Community votes reflect the credibility of
            a report. They do not establish guilt or
            replace moderator verification.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-[#66766f]">
            Loading community reports...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-700">{error}</p>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="bg-white border border-[#e0e3dc] p-10 text-center">
            <p className="text-[#66766f] text-sm">
              No reports have been submitted yet.
            </p>
          </div>
        )}

        {/* Community report cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <article
              key={report.id}
              className="bg-white border border-[#e0e3dc] p-6 md:p-8 flex flex-col"
            >
              <div className="flex justify-between items-center gap-3 border-b border-[#e9ebe6] pb-4 mb-5">
                <p className="text-[10px] tracking-[2px] text-[#d76b42] font-bold">
                  INCIDENT / {String(index + 1).padStart(3, "0")}
                </p>

                <span className="text-[10px] font-bold bg-[#f8e8d7] text-[#a65c36] px-3 py-2">
                  {report.status.toUpperCase()}
                </span>
              </div>

              <h2 className="text-2xl font-semibold leading-tight">
                {report.scam_type}
              </h2>

              <p className="text-xs text-[#71817d] mt-3">
                PLATFORM / {report.platform}
              </p>

              <p className="text-sm text-[#66766f] leading-7 mt-5 whitespace-pre-wrap break-words">
                {report.description}
              </p>

              {report.amount_bdt != null && (
                <div className="bg-[#f3f5ef] p-4 mt-5">
                  <p className="text-[10px] tracking-widest text-[#84918a]">
                    REPORTED LOSS
                  </p>
                  <p className="text-xl font-semibold mt-1">
                    ৳{report.amount_bdt.toLocaleString()}
                  </p>
                </div>
              )}

              <p className="text-[11px] text-[#89948e] mt-4 mb-6">
                Reported on{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </p>

              {/* Voting area */}
              <div className="border-t border-[#e9ebe6] pt-5 mt-auto">
                <p className="text-[10px] tracking-[2px] text-[#d76b42] font-bold">
                  COMMUNITY ASSESSMENT
                </p>

                <p className="text-sm font-semibold mt-2 mb-4">
                  How credible is this report?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={pending !== null}
                    onClick={() =>
                      submitVote(report.id, "credible")
                    }
                    className="bg-[#173b43] text-white p-4 hover:bg-[#24545b] transition-colors disabled:opacity-50"
                  >
                    <span className="text-xs font-semibold">
                      Credible
                    </span>

                    <span className="block text-2xl font-semibold mt-2">
                      {votes[report.id]?.credible_votes ?? "—"}
                    </span>
                  </button>

                  <button
                    disabled={pending !== null}
                    onClick={() =>
                      submitVote(report.id, "suspicious")
                    }
                    className="bg-[#faf4ec] border border-[#d76b42] text-[#a65c36] p-4 hover:bg-[#f8e8d7] transition-colors disabled:opacity-50"
                  >
                    <span className="text-xs font-semibold">
                      Suspicious
                    </span>

                    <span className="block text-2xl font-semibold mt-2">
                      {votes[report.id]?.suspicious_votes ?? "—"}
                    </span>
                  </button>
                </div>

                <p className="text-[11px] text-[#84918a] mt-4">
                  Total community votes:{" "}
                  {votes[report.id]?.total_votes ?? "—"}
                </p>

                {messages[report.id] && (
                  <div
                    className={`mt-4 p-3 text-xs border ${
                      messages[report.id].success
                        ? "bg-[#edf5ed] border-[#c8ddca] text-[#315d3d]"
                        : "bg-[#fff1ed] border-[#e6c5b8] text-[#a65c36]"
                    }`}
                  >
                    {messages[report.id].text}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="px-2 py-6 text-[10px] tracking-[2px] text-[#9aa49b] flex justify-between">
          <span>FRAUD LENS BD</span>
          <span>COMMUNITY / 002</span>
        </div>
      </section>
    </main>
  );
}
