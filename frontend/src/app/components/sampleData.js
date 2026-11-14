// SAMPLE DATA ONLY. These numbers and entries are made up for the demo.
// They are always shown with a "Sample data" label on the pages.

export const SAMPLE_REGISTRY = [
  {
    id: "sample-1",
    query: "01800000000",
    category: "Mobile financial service fraud (bKash/Nagad)",
    status: "Demo entry",
    details:
      "Sample entry: caller pretends to be a bKash agent and asks for PIN.",
    source: "demo",
    platform: "SMS / Phone call",
    amount_bdt: 5000,
    incident_date: null,
    reported_at: null,
  },
  {
    id: "sample-2",
    query: "sample-shop-bd.example",
    category: "Fake online shopping / E-commerce",
    status: "Demo entry",
    details:
      "Sample entry: shop page takes advance payment and never delivers.",
    source: "demo",
    platform: "Website",
    amount_bdt: 2200,
    incident_date: null,
    reported_at: null,
  },
  {
    id: "sample-3",
    query: "Quick Jobs Dhaka (page)",
    category: "Fake job / Recruitment offer",
    status: "Demo entry",
    details:
      "Sample entry: page asks for a registration fee before a job interview.",
    source: "demo",
    platform: "Facebook",
    amount_bdt: 1000,
    incident_date: null,
    reported_at: null,
  },
];

export const SAMPLE_MONTHLY = [
  { label: "Jun", value: 18 },
  { label: "Jul", value: 24 },
  { label: "Aug", value: 31 },
  { label: "Sep", value: 27 },
  { label: "Oct", value: 38 },
  { label: "Nov", value: 45 },
];

export const SAMPLE_PLATFORMS = [
  { label: "Facebook", value: 42 },
  { label: "bKash", value: 31 },
  { label: "Text Message / Phone call", value: 24 },
  { label: "WhatsApp", value: 15 },
  { label: "Website", value: 9 },
];