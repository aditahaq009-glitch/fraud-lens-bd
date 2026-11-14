import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/registry", label: "Registry" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/product-report", label: "Product vs Reality" },
  { href: "/report", label: "Report" },
  { href: "/analysis", label: "Analyze" },
];

export default function TopNav({ active }) {
  return (
    <nav className="border-b border-[#d9ddd5] px-6 md:px-12 py-5 flex flex-wrap justify-between items-center gap-4">
      <Link href="/" className="flex items-center gap-3">
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
      </Link>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#526761]">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              active === link.href
                ? "text-[#d76b42] font-semibold"
                : "hover:text-[#d76b42]"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}