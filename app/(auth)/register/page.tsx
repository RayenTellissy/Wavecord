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
