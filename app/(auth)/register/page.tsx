"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { WaveLogo } from "@/components/ui/WaveLogo";
import axios from "axios";

const FIELDS = [
  { key: "username", label: "Username",  type: "text",     autoComplete: "username"     },
  { key: "email",    label: "Email",     type: "email",    autoComplete: "email"        },
  { key: "password", label: "Password",  type: "password", autoComplete: "new-password" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: [] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.post("/api/register", { ...form, name: form.username });
      await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false,
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrors(err.response.data.error as Record<string, string[]>);
      } else {
        setErrors({ _: ["Something went wrong. Please try again."] });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 0.72rem 0.9rem;
          color: var(--text-primary);
          outline: none;
          font-size: 0.95rem;
          font-family: inherit;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          display: block;
          backdrop-filter: blur(8px);
        }
        .auth-input:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); }
        .auth-input:focus {
          border-color: rgba(139,92,246,0.6);
          background: rgba(139,92,246,0.05);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .auth-input.error { border-color: var(--danger); }
        .auth-input.error:focus { box-shadow: 0 0 0 3px rgba(244,63,94,0.18); }

        .auth-btn-primary {
          width: 100%;
          padding: 0.78rem;
          background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 60%, #a78bfa 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          font-family: inherit;
          letter-spacing: 0.01em;
          margin-top: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.1);
          transition: box-shadow 0.18s, transform 0.18s, opacity 0.18s;
        }
        .auth-btn-primary:hover:not(:disabled) {
          box-shadow: 0 6px 24px rgba(139,92,246,0.55), 0 0 60px rgba(139,92,246,0.15);
          transform: translateY(-1px);
        }
        .auth-btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(139,92,246,0.35);
        }
        .auth-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          background: "rgba(10,10,18,0.85)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "18px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.08), 0 0 80px rgba(139,92,246,0.05)",
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
            Create your account
          </p>
        </div>

        {errors._ && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1.5px solid rgba(239,68,68,0.25)",
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
            {errors._[0]}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {FIELDS.map(({ key, label, type, autoComplete }) => (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>{label}</label>
              <input
                className={`auth-input${errors[key]?.length ? " error" : ""}`}
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => set(key, e.target.value)}
                autoComplete={autoComplete}
                required
              />
              {errors[key]?.map((msg) => (
                <p key={msg} style={{ color: "var(--danger)", fontSize: "0.78rem", marginTop: "0.3rem" }}>
                  {msg}
                </p>
              ))}
            </div>
          ))}

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "1.4rem",
          color: "var(--text-secondary)",
          fontSize: "0.85rem",
        }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent)", fontWeight: 700 }}>
            Sign in
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
