"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000/analysis";

// Sample messages so the demo is quick. Clearly labeled as examples on the page.
const EXAMPLES = [
  {
    label: "Example: bKash scam",
    text: "Congratulations! You have won a prize of 50000 taka. Send your bKash OTP and PIN urgently to claim it: http://bit.ly/claim-now",
  },
  {
    label: "Example: normal message",
    text: "Hi, the meeting is moved to 5 pm tomorrow. Please bring the printed notes.",
  },
];

// Full class strings so Tailwind can find them
const LEVEL_STYLES = {
  High: {
    badge: "bg-[#f8e1d8] text-[#a63d1f]",
    bar: "bg-[#c2492a]",
    summary: "High risk. Treat this message as a scam.",
  },
  Medium: {
    badge: "bg-[#f8ecd2] text-[#8a6212]",
    bar: "bg-[#d49a1f]",
    summary: "Medium risk. Be careful and check before you act.",
  },
  Low: {
    badge: "bg-[#e2efe3] text-[#315d3d]",
    bar: "bg-[#4f8a5b]",
    summary: "Low risk. No strong warning signs found.",
  },
};

export default function AnalysisPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  // Scroll to the result when it arrives
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError("Write at least 10 characters so we can check the message.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (response.status === 422) {
        throw new Error("validation");
      }
      if (!response.ok) {
        throw new Error("server");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err.message === "validation") {
        setError("The message must be between 10 and 5000 characters.");
      } else if (err.message === "server") {
        setError("The server had a problem. Try again in a moment.");
      } else {
        setError(
          "Could not reach the analysis server. Check that the backend is running on port 8000."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setResult(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const level = result ? LEVEL_STYLES[result.risk_level] : null;

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
          <a href="/analysis" className="text-[#d76b42] font-semibold">
            Scam check
          </a>
          <a href="/report" className="hover:text-[#d76b42]">
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
            SCAM ANALYSIS DESK
          </p>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-[-3px] leading-[1.05]">
          Got a strange message?
          <br />
          <span className="text-[#d76b42] italic font-normal">
            Check it first.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
          Paste the SMS, WhatsApp or Facebook message you received. We look for
          warning signs and tell you what to do next. Do not reply to the sender
          until you have checked.
        </p>
      </section>

      {/* Main area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-6">
          <div className="space-y-6">
            {/* Input form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#e0e3dc] p-6 md:p-10"
            >
              <div className="border-b border-[#e9ebe6] pb-5 mb-8">
                <h2 className="text-2xl font-semibold">Message to check</h2>
                <p className="text-xs text-[#84918a] mt-2">
                  Works with English and Bangla text.
                </p>
              </div>

              <label htmlFor="message" className="block text-xs font-bold mb-2">
                Paste the message here *
              </label>
              <textarea
                id="message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                maxLength={5000}
                disabled={loading}
                placeholder="Example: Your bKash account will be blocked. Send your OTP now to keep it active..."
                className="w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none resize-y focus:border-[#d76b42] disabled:opacity-60"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example.label}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setText(example.text);
                        setError("");
                      }}
                      className="text-[11px] border border-[#cbd3c9] px-3 py-2 text-[#526761] hover:border-[#d76b42] hover:text-[#d76b42] disabled:opacity-60"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-[#89948e]">
                  {text.length} / 5000
                </span>
              </div>

              {/* Upload placeholders (not working yet) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div
                  aria-disabled="true"
                  className="border-2 border-dashed border-[#d7dcd4] bg-[#f8f9f5] p-5 text-center opacity-70"
                >
                  <p className="font-semibold text-sm">Screenshot upload</p>
                  <p className="text-xs text-[#84918a] mt-1">
                    Coming soon. Prototype only.
                  </p>
                </div>
                <div
                  aria-disabled="true"
                  className="border-2 border-dashed border-[#d7dcd4] bg-[#f8f9f5] p-5 text-center opacity-70"
                >
                  <p className="font-semibold text-sm">Voice note upload</p>
                  <p className="text-xs text-[#84918a] mt-1">
                    Coming soon. Prototype only.
                  </p>
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 p-4 bg-[#fbeae4] border border-[#efc7b8] text-[#8c3a1f] text-sm"
                >
                  <p className="font-bold">Could not check the message</p>
                  <p className="text-xs mt-1 leading-5">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 bg-[#173b43] text-white py-5 text-sm font-semibold tracking-wide hover:bg-[#24545b] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Checking the message..." : "Check this message"}
              </button>

              {/* Loading state */}
              {loading && (
                <div
                  role="status"
                  className="mt-4 flex items-center gap-3 text-xs text-[#66766f]"
                >
                  <span className="inline-block w-4 h-4 border-2 border-[#d76b42] border-t-transparent rounded-full animate-spin" />
                  Looking for warning signs. This takes a moment.
                </div>
              )}
            </form>

            {/* Result */}
            {result && level && (
              <div ref={resultRef} className="space-y-6 scroll-mt-6">
                {/* Score card */}
                <div className="bg-white border border-[#e0e3dc] p-6 md:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#84918a]">Risk score</p>
                      <p className="text-6xl font-semibold tracking-tight mt-1">
                        {result.risk_score}
                        <span className="text-2xl text-[#9aa49b]"> / 100</span>
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-4 py-2 ${level.badge}`}
                    >
                      {result.risk_level} risk
                    </span>
                  </div>

                  <div
                    className="mt-6 h-2 bg-[#ecefe8]"
                    role="progressbar"
                    aria-valuenow={result.risk_score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Risk score"
                  >
                    <div
                      className={`h-2 ${level.bar}`}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>

                  <p className="mt-5 font-semibold text-sm">{level.summary}</p>
                 {/* <p className="text-xs text-[#66766f] leading-6 mt-2">
                    {result.explanation}
                  </p>

                  <div className="mt-6 pt-5 border-t border-[#e9ebe6] flex items-center justify-between gap-4">
                    <span className="text-xs text-[#69776e]">Scam type</span>
                    <span className="text-sm font-semibold text-right">
                      {result.category}
                    </span>
                  </div> */}
                </div>

                {/* Scam category */}
                <div className="bg-white border border-[#e0e3dc] p-6 md:p-10">
                  <p className="text-xs text-[#84918a]">Scam category</p>
                  <p className="text-2xl font-semibold mt-2">
                    {result.category}
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-white border border-[#e0e3dc] p-6 md:p-10">
                  <h3 className="text-xl font-semibold">
                    Why we gave this score
                  </h3>
                  <p className="text-sm text-[#66766f] leading-7 mt-4">
                    {result.explanation}
                  </p>
                </div>

                {/* Warning signs */}
                <div className="bg-white border border-[#e0e3dc] p-6 md:p-10">
                  <h3 className="text-xl font-semibold">Warning signs found</h3>
                  {result.indicators.length === 0 ? (
                    <p className="text-xs text-[#66766f] mt-4">
                      No known warning signs found in this message.
                    </p>
                  ) : (
                    <ul className="mt-5 space-y-3">
                      {result.indicators.map((item) => (
                        <li
                          key={item.label}
                          className="flex items-center justify-between gap-4 bg-[#f3f5ef] p-4 text-sm"
                        >
                          <span>{item.label}</span>
                          <span className="text-xs font-bold text-[#d76b42] whitespace-nowrap">
                            +{item.points} points
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Next steps */}
                <div className="bg-[#173b43] text-[#f3f2ec] p-6 md:p-10">
                  <h3 className="text-xl font-semibold">Recommended actions</h3>
                  <ul className="mt-5 space-y-4">
                    {result.next_steps.map((step) => (
                      <li
                        key={step}
                        className="flex gap-4 border-t border-[#426168] pt-4 text-sm leading-6"
                      >
                        <span className="mt-2 w-2 h-2 bg-[#e38a60] shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 px-1">
                  <p className="text-[11px] text-[#89948e]">
                    Method: {result.method}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs border border-[#cbd3c9] px-4 py-3 text-[#526761] hover:border-[#d76b42] hover:text-[#d76b42]"
                  >
                    Check another message
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right-side panel */}
          <aside className="space-y-5 lg:self-start">
            <div className="bg-[#173b43] text-[#f3f2ec] p-7 md:p-8">
              <h3 className="text-3xl font-semibold leading-tight">
                Three rules
                <br />
                that stop most scams.
              </h3>

              <div className="mt-8 space-y-6">
                {[
                  ["Never share your OTP or PIN", "Real bKash, Nagad and bank staff never ask for it."],
                  ["Do not click unknown links", "Shortened links often hide fake websites."],
                  ["Pause when it feels urgent", "Scammers rush you so you cannot think."],
                ].map(([title, description]) => (
                  <div key={title} className="border-t border-[#426168] pt-5">
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-[#b4c5bd] leading-5 mt-1">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#e9e8df] p-7 border border-[#d9ddd5]">
              <p className="text-xs font-bold text-[#d76b42]">Prototype notice</p>
              <h3 className="text-xl font-semibold mt-3">
                This check uses simple rules.
              </h3>
              <p className="text-xs text-[#69776e] leading-6 mt-3">
                It is not AI yet, and it can be wrong. A low score does not
                prove a message is safe. If you feel unsure, ask the real
                company using its official number.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}