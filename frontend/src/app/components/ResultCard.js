"use client";

import { useState } from "react";
import Link from "next/link";

function statusStyle(status = "") {
  const s = status.toLowerCase();
  if (s.includes("demo")) return "bg-[#e6e9f2] text-[#3b4a7a]";
  if (s.startsWith("verified")) return "bg-[#e2ece5] text-[#2f6b52]";
  if (s.startsWith("dismissed")) return "bg-[#e9ebe6] text-[#66766f]";
  // Unverified, Disputed and anything else
  return "bg-[#f8ecd2] text-[#8a6212]";
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ResultCard({ item }) {
  const [open, setOpen] = useState(false);
  const isDemo = item.source === "demo";
  const isUnverified = (item.status || "").toLowerCase() === "unverified";

  return (
    <div className="bg-white border border-[#e0e3dc] p-5 md:p-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <p className="font-semibold text-lg break-all">{item.query}</p>
        <span
          className={`text-xs font-semibold px-3 py-1 ${statusStyle(
            item.status
          )}`}
        >
          {item.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#71817d]">
        <span>{item.category}</span>
        <span className="tracking-[2px] font-bold text-[#d76b42]">
          {isDemo ? "DEMO DATA" : "COMMUNITY REPORT"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-4 text-sm font-semibold text-[#173b43] hover:text-[#d76b42]"
      >
        {open ? "Hide details −" : "View details +"}
      </button>

      {open && (
        <div className="mt-4 border-t border-[#e9ebe6] pt-4 space-y-3 text-sm">
          <p className="text-[#526761] leading-7 whitespace-pre-line">
            {item.details}
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
            {item.platform && (
              <div>
                <dt className="text-[#87948b] tracking-[1px]">PLATFORM</dt>
                <dd className="font-semibold mt-1">{item.platform}</dd>
              </div>
            )}
            {item.amount_bdt != null && (
              <div>
                <dt className="text-[#87948b] tracking-[1px]">
                  AMOUNT LOST
                </dt>
                <dd className="font-semibold mt-1">
                  {Number(item.amount_bdt).toLocaleString("en-US")} BDT
                </dd>
              </div>
            )}
            {item.incident_date && (
              <div>
                <dt className="text-[#87948b] tracking-[1px]">
                  INCIDENT DATE
                </dt>
                <dd className="font-semibold mt-1">
                  {formatDate(item.incident_date)}
                </dd>
              </div>
            )}
            {item.reported_at && (
              <div>
                <dt className="text-[#87948b] tracking-[1px]">REPORTED ON</dt>
                <dd className="font-semibold mt-1">
                  {formatDate(item.reported_at)}
                </dd>
              </div>
            )}
          </dl>

          {isUnverified && (
            <p className="text-xs text-[#8a6212] bg-[#fbf3de] p-3">
              This is a community report and has not been verified. It does
              not prove that the person or seller is a fraudster.
            </p>
          )}

          <Link
            href="/report"
            className="inline-block text-xs font-semibold text-[#d76b42] hover:underline"
          >
            Experienced something similar? Report it →
          </Link>
        </div>
      )}
    </div>
  );
}