
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("user");
          router.replace("/login");
          return;
        }

        const user = await response.json();

        sessionStorage.setItem("user", JSON.stringify(user));

        if (active) {
          setAuthorized(true);
        }
      } catch {
        if (active) {
          setError("Unable to verify your session. Please try again.");
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f5] text-[#173b43]">
        Checking your session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#faf9f5] text-[#173b43]">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#173b43] text-white px-5 py-3"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!authorized) return null;

  return children;
}
