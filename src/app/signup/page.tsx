"use client";

import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: name,
          password: password,
        }),
      });

      const result = await res.json();
      console.log("✅ Signup result:", result);
      alert(result.message || "Signup successful!");
    } catch (err) {
      console.error("❌ Signup failed:", err);
      alert("Failed to connect to the backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image src="/veritas.svg" alt="Star logo" width={28} height={28} />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Your Account
          </h1>
          <p className="text-md text-gray-400">Transparency starts here</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="border border-gray-200 shadow-md rounded-xl p-6 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Company Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2e759d]"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2e759d]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-medium text-sm sm:text-base h-12 px-6"
          >
            Sign Up
          </button>

          {message && (
            <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          )}
        </form>

        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-800 underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
