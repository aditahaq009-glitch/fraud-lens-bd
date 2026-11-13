"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";

const API_URL = "http://127.0.0.1:8000";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB, same limit as the backend

const INPUT_CLASS =
  "w-full border border-[#dce1da] bg-[#fafbf8] p-4 text-sm outline-none focus:border-[#d76b42]";

function readError(data, fallback) {
  return typeof data?.detail === "string" ? data.detail : fallback;
}

async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`${API_URL}/evidence/upload`, {
    method: "POST",
    body,
  });
  const data = await res.json();

  if (!res.ok) throw new Error(readError(data, "Evidence upload failed."));
  return data.filename;
}

export default function ProductReportPage() {
  const [advertisedFile, setAdvertisedFile] = useState(null);
  const [deliveredFile, setDeliveredFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reportId, setReportId] = useState("");

  function pickFile(e, setter) {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_FILE_SIZE) {
      setError("Each image must be 5 MB or smaller.");
      e.target.value = "";
      setter(null);
      return;
    }
    setError("");
    setter(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);

    setSubmitting(true);
    setError("");

    try {
      // Step 1: upload the images (optional)
      const evidence_files = [];
      for (const file of [advertisedFile, deliveredFile]) {
        if (file) evidence_files.push(await uploadFile(file));
      }

      // Step 2: build the report from the form fields
      const paymentNumber = (f.get("payment_number") || "").trim();
      const pageLink = (f.get("page_link") || "").trim();
      const seller = f.get("seller").trim();

      const description = [
        "Product vs Reality report.",
        `Product: ${f.get("product").trim()}`,
        `Seller / page: ${seller}`,
        pageLink && `Seller page link: ${pageLink}`,
        paymentNumber && `Seller payment number: ${paymentNumber}`,
        `Advertised: ${f.get("advertised").trim()}`,
        `Delivered: ${f.get("delivered").trim()}`,
      ]
        .filter(Boolean)
        .join("\n");

      const payload = {
        scam_type: "Fake online shopping / E-commerce",
        platform: f.get("platform"),
        incident_date: f.get("incident_date") || null,
        suspicious_identifier: paymentNumber || pageLink || seller,
        description,
        amount_bdt: f.get("amount_bdt") ? Number(f.get("amount_bdt")) : null,
        evidence_files,
      };

      // Step 3: save it with the existing report API
      const res = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          readError(data, "Please check the form fields and try again.")
        );
      }

      setReportId(data.report.id);
      form.reset();
      setAdvertisedFile(null);
      setDeliveredFile(null);
    } catch (err) {
      console.error("Product report failed:", err);
      setError(err.message || "Could not submit your report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f2ec] text-[#172b35]">
      <TopNav active="/product-report" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-9">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-[2px] bg-[#d76b42]" />
          <p className="text-xs font-bold tracking-[3px] text-[#71817d]">
            PRODUCT VS REALITY
          </p>
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-[-3px] leading-[1.05]">
          What they showed,
          <br />
          <span className="text-[#d76b42] italic font-normal">
            what you got.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[#66766f] leading-7 text-sm">
          Ordered something online and received something very different?
          Compare the advertised product with what was delivered and warn
          others.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-6">
          {reportId ? (
            <div className="bg-white border border-[#e0e3dc] p-6 md:p-10">
              <p className="text-[10px] tracking-[2px] text-[#d76b42] font-bold">
                REPORT SUBMITTED
              </p>
              <h2 className="text-2xl font-semibold mt-2">
                Thank you for reporting.
              </h2>
              <p className="text-sm text-[#66766f] leading-7 mt-3">
                Your report was saved with the status{" "}
                <strong>Unverified</strong>. Reference ID:
              </p>
              <p className="font-mono text-xs mt-2 break-all bg-[#f3f2ec] p-3">
                {reportId}
              </p>
              <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setReportId("")}
                  className="bg-[#173b43] text-white px-6 py-3 hover:bg-[#24545b]"
                >
                  Submit another report
                </button>
                <Link
                  href="/registry"
                  className="px-6 py-3 border border-[#cbd3c9] hover:border-[#d76b42]"
                >
                  View registry
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#e0e3dc] p-6 md:p-10"
            >
              <div className="border-b border-[#e9ebe6] pb-5 mb-8">
                <p className="text-[10px] tracking-[2px] text-[#d76b42] font-bold">
                  COMPARISON REPORT
                </p>
                <h2 className="text-2xl font-semibold mt-1">
                  Product and seller details
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold mb-2">
                    Product name *
                  </label>
                  <input
                    name="product"
                    required
                    placeholder="e.g. Wireless earbuds"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Seller or page name *
                    </label>
                    <input
                      name="seller"
                      required
                      placeholder="e.g. Trendy Gadgets BD"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Where did you order? *
                    </label>
                    <select
                      name="platform"
                      required
                      defaultValue=""
                      className={INPUT_CLASS}
                    >
                      <option value="" disabled>
                        Select platform
                      </option>
                      <option>Facebook</option>
                      <option>WhatsApp</option>
                      <option>Website</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Seller page or website link
                    </label>
                    <input
                      name="page_link"
                      placeholder="https://..."
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Seller payment number (bKash / Nagad)
                    </label>
                    <input
                      name="payment_number"
                      placeholder="01XXXXXXXXX"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Amount paid (BDT)
                    </label>
                    <input
                      name="amount_bdt"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Date of purchase
                    </label>
                    <input
                      name="incident_date"
                      type="date"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">
                    What was advertised? *
                  </label>
                  <textarea
                    name="advertised"
                    required
                    minLength={5}
                    rows={3}
                    placeholder="Describe what the seller promised (quality, features, size...)."
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2">
                    What did you actually receive? *
                  </label>
                  <textarea
                    name="delivered"
                    required
                    minLength={5}
                    rows={3}
                    placeholder="Describe what arrived and how it differs."
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Advertised image (PNG or JPG)
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => pickFile(e, setAdvertisedFile)}
                      className="block w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2">
                      Delivered image (PNG or JPG)
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => pickFile(e, setDeliveredFile)}
                      className="block w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-[#fbeae4] border border-[#efc9bb] text-[#a63d1f] text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-7 bg-[#173b43] text-white py-5 text-sm font-semibold tracking-wide hover:bg-[#24545b] transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit comparison report"}
              </button>
            </form>
          )}

          <aside className="space-y-5">
            <div className="bg-[#173b43] text-[#e9f0df] p-6">
              <p className="text-[10px] tracking-[3px] text-[#a6bcb1]">
                TIPS
              </p>
              <ul className="mt-4 space-y-4 text-sm leading-6">
                <li>Save screenshots of the original advertisement.</li>
                <li>Photograph the delivered item from several sides.</li>
                <li>Keep your bKash or Nagad transaction ID.</li>
              </ul>
            </div>

            <div className="bg-white border border-[#e0e3dc] p-6">
              <p className="text-[10px] tracking-[2px] font-bold text-[#d76b42]">
                PLEASE NOTE
              </p>
              <p className="text-xs text-[#66766f] leading-6 mt-3">
                Reports are saved as unverified. A report alone does not prove
                that a seller is a fraudster. Only describe what happened to
                you. Do not upload personal documents.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}