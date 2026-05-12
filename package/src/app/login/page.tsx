"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  return (
    <section className="pt-42">
      <div className="container">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
          <div className="border border-black/20 dark:border-white/20 rounded-lg px-6 py-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-black/20 dark:border-white/20 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-black/20 dark:border-white/20 rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-md px-4 py-2 font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
