"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Login failed: ${text}`);
      }

      const data = await res.json();
      console.log("✅ Login success:", data);
      setSuccess("Logged in successfully!");

      // Save token locally (optional)
      localStorage.setItem("veritas_token", data.token);

      // Redirect to dashboard
      router.push("/control");
    } catch (err: any) {
      console.error("❌", err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Image src="/veritas.svg" alt="Star logo" width={28} height={28} />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="border border-gray-200 shadow-md rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              id="company"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2e759d]"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2e759d]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white hover:opacity-90 font-medium text-sm sm:text-base h-12 px-6"
          >
            Log In
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        </form>

        <p className="text-center text-xs text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-800 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
