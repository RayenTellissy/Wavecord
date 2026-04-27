"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { WaveLogo } from "@/components/ui/WaveLogo";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  async function handleGitHub() {
    await signIn("github", { callbackUrl });
  }

  return (
    <>
      <style>{`
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 12px;
          padding: 0.76rem 1rem;
          color: var(--text-primary);
          outline: none;
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          display: block;
          backdrop-filter: blur(20px) saturate(1.8);
          -webkit-backdrop-filter: blur(20px) saturate(1.8);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .auth-input:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.20);
        }
        .auth-input:focus {
          border-color: rgba(139,92,246,0.55);
          background: rgba(139,92,246,0.07);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.14), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .auth-input::placeholder { color: var(--text-muted); }
        .auth-input.error { border-color: rgba(244,63,94,0.55); }
        .auth-input.error:focus { box-shadow: 0 0 0 3px rgba(244,63,94,0.16); }

        .auth-btn-primary {
          width: 100%;
          padding: 0.82rem;
          background: linear-gradient(135deg, rgba(124,58,237,0.90) 0%, rgba(139,92,246,0.95) 55%, rgba(167,139,250,0.88) 100%);
          color: #fff;
          border: 1px solid rgba(167,139,250,0.45);
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          font-family: inherit;
          letter-spacing: 0.01em;
          margin-top: 0.5rem;
          cursor: pointer;
          box-shadow:
            0 6px 20px rgba(139,92,246,0.42),
            0 0 60px rgba(139,92,246,0.12),
            inset 0 1.5px 0 rgba(255,255,255,0.28),
            inset 0 -1px 0 rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s;
          backdrop-filter: blur(8px);
        }
        .auth-btn-primary:hover:not(:disabled) {
          box-shadow:
            0 10px 32px rgba(139,92,246,0.60),
            0 0 80px rgba(139,92,246,0.18),
            inset 0 1.5px 0 rgba(255,255,255,0.30),
            inset 0 -1px 0 rgba(0,0,0,0.15);
          transform: translateY(-1.5px);
        }
        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(139,92,246,0.38), inset 0 1px 0 rgba(255,255,255,0.20);
        }
        .auth-btn-primary:disabled { opacity: 0.60; cursor: not-allowed; }

        .auth-btn-github {
          width: 100%;
          padding: 0.76rem 1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 12px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: inherit;
          margin-bottom: 1.25rem;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.15s;
          backdrop-filter: blur(20px) saturate(1.8);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .auth-btn-github:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.22);
          box-shadow: 0 6px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.14);
          transform: translateY(-1.5px);
        }
        .auth-btn-github:active { transform: translateY(0); }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 400, mass: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
            <WaveLogo size={52} />
          </div>
          <div style={{
            fontSize: "1.55rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.6px",
            marginBottom: "0.25rem",
          }}>
            Wavecord
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Welcome back! Sign in to continue.
          </p>
        </div>

        <button className="auth-btn-github" onClick={handleGitHub}>
          <GitHubSVG />
          Continue with GitHub
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", letterSpacing: "0.04em" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(244,63,94,0.08)",
              border: "1.5px solid rgba(244,63,94,0.25)",
              borderRadius: "8px",
              padding: "0.65rem 0.85rem",
              color: "var(--danger)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Username</label>
            <input
              className="auth-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "1.4rem",
          color: "var(--text-secondary)",
          fontSize: "0.85rem",
        }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--accent-bright)", fontWeight: 700 }}>
            Register
          </Link>
        </p>
      </motion.div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "0.4rem",
};

function GitHubSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
