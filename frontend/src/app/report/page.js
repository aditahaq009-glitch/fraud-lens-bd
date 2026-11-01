
"use client";

import { useState } from "react";

export default function ReportPage() {
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");
  
async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const payload = {
    scam_type: formData.get("scam_type"),
    platform: formData.get("platform"),
    incident_date: formData.get("incident_date") || null,
    suspicious_identifier: formData.get("suspicious_identifier") || null,
    description: formData.get("description"),
    amount_bdt: formData.get("amount_bdt")
      ? Number(formData.get("amount_bdt"))
      : null,
    evidence_files: files.map((file) => file.name),
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data.detail));
    }

    setSubmitted(true);
    setReportId(data.report.id);
    console.log("Report successfully created:", data.report);

  } catch (error) {
    console.error("Report submission failed:", error);
    alert("Could not submit your report. Please try again.");
  }
}


  return (
    <main className="min-h-screen bg-[#f3f2ec] text-[#172b35]">
      {/* Top navigation */}
      <nav className="border-b border-[#d9ddd5] px-6 md:px-12 py-5 flex justify-between items-center">
        <a href="/" className="flex items-center gap-3">
          <div className="bg-[#173b43] text-[#e9f0df] w-10 h-10 flex items-center justify-center font-bold text-xl">
            F.
          </div>
          <div>
            <p className="font-bold tracking-tight text-lg leading-none">
              FRAUD LENS <span className="text-[#d76b42]">BD</span>
            </p>
            <p className="text-[9px] tracking-[3px] mt-1 text-[#71817d]">
              COMMUNITY INTELLIGENCE
            </p>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#526761]">
          <a href="/" className="hover:text-[#d76b42]">Home</a>
          <a href="/report" className="text-[#d76b42] font-semibold">
            Report an incident
          </a>
          <span className="border border-[#cbd3c9] px-4 py-2 text-xs">
            BANGLADESH / BD
          </span>
        </div>
      </nav>

      {/* Page introduction */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-9">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-[#d76b42]" />
          <p className="text-xs font-bold tracking-[3px] text-[#71817d]">
            COMMUNITY INCIDENT DESK / 001
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-[-3px] leading-[1.05]">
              Every report
              <br />
              <span className="text-[#d76b42] italic font-normal">
                matters.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
              Spotted something suspicious? Document what happened.
              Your evidence could help protect someone else from
              falling into the same trap.
            </p>
          </div>

          <div className="md:text-right pb-2">
            <p className="text-xs text-[#87948b] tracking-widest">
              REPORTING IS
            </p>
            <p className="text-sm font-semibold mt-1">
              OPEN TO EVERYONE
            </p>
          </div>
        </div>
      </section>

      {/* Main form area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-6">

          {/* Report form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#e0e3dc] p-6 md:p-10"
          >
            <div className="flex justify-between items-center border-b border-[#e9ebe6] pb-5 mb-8">
              <div>
                <p className="text-[10px] tracking-[2px] text-[#d76b42] font-bold">
                  SECTION 01
                </p>
                <h2 className="text-2xl font-semibold mt-1">
                  Incident details
                </h2>
              </div>
              <span className="text-xs text-[#84918a]">01 / 03</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold mb-2">
                  What type of scam did you encounter? *
                </label>
                <select
                  name="scam_type"
                  required
                  defaultValue=""
                  className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none focus:border-[#d76b42]"
                >
                  <option value="" disabled>Select incident category</option>
                  <option>Mobile financial service fraud (bKash/Nagad)</option>
                  <option>Fake online shopping / E-commerce</option>
                  <option>Phishing / Suspicious links</option>
                  <option>Fake job / Recruitment offer</option>
                  <option>Investment / Financial fraud</option>
                  <option>Impersonation / Fake identity</option>
                  <option>OTP / Account takeover</option>
                  <option>Other / Unclassified suspicious activity</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold mb-2">
                    Platform involved *
                  </label>
                  <select
                    name="platform"
                    required
                    defaultValue=""
                    className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none focus:border-[#d76b42]"
                  >
                    <option value="" disabled>Select platform</option>
                    <option>Facebook</option>
                    <option>WhatsApp</option>
                    <option>SMS / Phone call</option>
                    <option>bKash</option>
                    <option>Nagad</option>
                    <option>Website</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">
                    Incident date
                  </label>
                  <input
                    type="date"
                    name="incident_date"
                    className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none focus:border-[#d76b42]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">
                  Suspicious phone / wallet / page / URL
                </label>
                <input
                  type="text"
                  name="suspicious_identifier"
                  placeholder="e.g. 01XXXXXXXXX or facebook.com/example"
                  className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none focus:border-[#d76b42]"
                />
                <p className="text-[11px] text-[#89948e] mt-2">
                  Provide the identifier involved in the incident, if known.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">
                  How did it happen? *
                </label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe what happened, what you were told, and any suspicious activity you noticed..."
                  className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none resize-y focus:border-[#d76b42]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">
                  Amount involved (BDT)
                </label>
                <input
                  type="number"
                  name="amount_bdt"
                  min="0"
                  placeholder="Enter amount, if applicable"
                  className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none focus:border-[#d76b42]"
                />
              </div>
            </div>

            {/* Evidence upload */}
            <div className="border-t border-[#e9ebe6] mt-10 pt-8">
              <div className="mb-5">
                <p className="text-[10px] tracking-[2px] text-[#d76b42] font-bold">
                  SECTION 02
                </p>
                <h2 className="text-2xl font-semibold mt-1">
                  Evidence archive
                </h2>
                <p className="text-xs text-[#84918a] mt-2">
                  Screenshots and supporting documents help reviewers
                  understand your report.
                </p>
              </div>

              <label className="block border-2 border-dashed border-[#cbd5cb] bg-[#f8f9f5] p-8 text-center cursor-pointer hover:border-[#d76b42] transition-colors">
                <div className="text-3xl text-[#d76b42] mb-3">+</div>
                <p className="font-semibold text-sm">
                  Attach supporting evidence
                </p>
                <p className="text-xs text-[#84918a] mt-2">
                  Click to browse images or documents
                </p>
                <p className="text-[10px] text-[#a0aaa2] mt-3">
                  PNG, JPG, JPEG, PDF
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    setFiles(Array.from(e.target.files || []));
                  }}
                />
              </label>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex justify-between bg-[#f3f5ef] p-3 text-xs"
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="text-[#d76b42] ml-3">Attached</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy and submit */}
            <div className="border-t border-[#e9ebe6] mt-10 pt-7">
              <label className="flex items-start gap-3 text-xs text-[#68776f] leading-5">
                <input type="checkbox" required className="mt-1 accent-[#d76b42]" />
                <span>
                  I confirm that the information provided is accurate
                  to the best of my knowledge and that I have the right
                  to share the attached evidence.
                </span>
              </label>

              <button
                type="submit"
                className="w-full mt-7 bg-[#173b43] text-white py-5 text-sm font-semibold tracking-wide hover:bg-[#24545b] transition-colors"
              >
                Submit incident report <span className="ml-2">→</span>
              </button>

              {submitted && (
                <div className="mt-4 p-5 bg-[#edf5ed] border border-[#c8ddca] text-[#315d3d]">
                  <p className="font-bold text-sm">
                    Report submitted successfully!
                 </p>

                 <p className="text-xs mt-2">
                   Your report has been received by Fraud Lens BD.
                 </p>

                 <div className="mt-4 pt-3 border-t border-[#c8ddca]">
                    <p className="text-xs">Report Reference ID</p>
                    <p className="text-xs font-mono mt-1 break-all">
                    {reportId}
                    </p>

                    <p className="text-xs mt-3">
                        Status: <strong>UNVERIFIED</strong>
                    </p>
                </div>
            </div>
        )}

              <p className="text-center text-[10px] text-[#9aa49b] mt-4">
                YOUR EVIDENCE DESERVES CAREFUL HANDLING.
              </p>
            </div>
          </form>

          {/* Right-side investigation panel */}
          <aside className="space-y-5">
            <div className="bg-[#173b43] text-[#f3f2ec] p-7 md:p-8">
              <p className="text-[10px] tracking-[3px] text-[#a6bcb1]">
                BEFORE YOU SUBMIT
              </p>
              <h3 className="text-3xl font-semibold mt-5 leading-tight">
                Build a
                <br />
                clearer picture.
              </h3>
              <p className="text-sm text-[#c2d1c7] leading-7 mt-4">
                A useful report is more than an accusation. It is
                information that can be examined and independently
                reviewed.
              </p>

              <div className="mt-9 space-y-6">
                {[
                  ["01", "Preserve evidence", "Keep original screenshots and transaction records."],
                  ["02", "Include details", "Mention dates, platforms and suspicious identifiers."],
                  ["03", "Stay factual", "Describe what happened without making unsupported claims."]
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-4 border-t border-[#426168] pt-5">
                    <span className="text-[#e38a60] text-xs">{number}</span>
                    <div>
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-[#b4c5bd] leading-5 mt-1">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#e9e8df] p-7 border border-[#d9ddd5]">
              <p className="text-[10px] tracking-[2px] font-bold text-[#d76b42]">
                IMPORTANT / TRUST & SAFETY
              </p>
              <h3 className="text-xl font-semibold mt-3">
                A report isn't a verdict.
              </h3>
              <p className="text-xs text-[#69776e] leading-6 mt-3">
                All submitted reports should initially remain
                unverified. Community evidence and moderation
                are needed before a status can be confirmed.
              </p>
              <div className="mt-5 border-t border-[#d1d4ca] pt-4 flex items-center justify-between">
                <span className="text-xs text-[#69776e]">
                  Initial report status
                </span>
                <span className="text-[10px] font-bold bg-[#f8e8d7] text-[#a65c36] px-3 py-2">
                  UNVERIFIED
                </span>
              </div>
            </div>

            <div className="px-2 py-3 text-[10px] tracking-[2px] text-[#9aa49b] flex justify-between">
              <span>FRAUD LENS BD</span>
              <span>REPORT / 001</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
