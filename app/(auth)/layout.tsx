"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "1rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes orb-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(60px, -80px) scale(1.08); }
          66%  { transform: translate(-40px, 50px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-70px, 60px) scale(1.06); }
          66%  { transform: translate(50px, -40px) scale(0.97); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(40px, 70px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-4 {
          0%   { transform: translate(0, 0) scale(1); }
          40%  { transform: translate(-50px, -60px) scale(1.1); }
          80%  { transform: translate(30px, 40px) scale(0.92); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes particle-float {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50%  { transform: translateY(-20px) translateX(8px); opacity: 0.7; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
        }
        @keyframes grid-shimmer {
          0%   { opacity: 0.025; }
          50%  { opacity: 0.045; }
          100% { opacity: 0.025; }
        }
      `}</style>

      {/* Orb 1 — large violet, top-left */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-8%",
        width: "55vw",
        height: "55vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.16) 45%, transparent 70%)",
        filter: "blur(70px)",
        animation: "orb-drift-1 22s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Orb 2 — cyan, bottom-right */}
      <div style={{
        position: "absolute",
        bottom: "-12%",
        right: "-10%",
        width: "52vw",
        height: "52vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at 60% 60%, rgba(34,211,238,0.20) 0%, rgba(6,182,212,0.12) 45%, transparent 70%)",
        filter: "blur(80px)",
        animation: "orb-drift-2 26s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Orb 3 — pink/rose, top-right */}
      <div style={{
        position: "absolute",
        top: "5%",
        right: "-5%",
        width: "36vw",
        height: "36vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.16) 0%, rgba(190,24,93,0.08) 50%, transparent 72%)",
        filter: "blur(60px)",
        animation: "orb-drift-3 18s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Orb 4 — deep purple, bottom-left */}
      <div style={{
        position: "absolute",
        bottom: "0%",
        left: "-5%",
        width: "38vw",
        height: "38vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 60%, rgba(124,58,237,0.18) 0%, rgba(91,33,182,0.10) 50%, transparent 72%)",
        filter: "blur(65px)",
        animation: "orb-drift-4 30s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Subtle dot grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        animation: "grid-shimmer 8s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Floating particles */}
      {[
        { top: "18%", left: "12%", delay: "0s",   size: 3, duration: "7s"  },
        { top: "72%", left: "22%", delay: "1.4s", size: 2, duration: "9s"  },
        { top: "35%", left: "82%", delay: "2.8s", size: 3, duration: "6s"  },
        { top: "60%", left: "70%", delay: "0.7s", size: 2, duration: "11s" },
        { top: "85%", left: "55%", delay: "3.5s", size: 2, duration: "8s"  },
        { top: "12%", left: "60%", delay: "1.9s", size: 3, duration: "10s" },
        { top: "50%", left: "5%",  delay: "4.2s", size: 2, duration: "7s"  },
        { top: "28%", left: "46%", delay: "2.1s", size: 2, duration: "13s" },
      ].map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          top: p.top,
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: "50%",
          background: i % 3 === 0
            ? "rgba(167,139,250,0.65)"
            : i % 3 === 1
            ? "rgba(34,211,238,0.55)"
            : "rgba(236,72,153,0.50)",
          boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${
            i % 3 === 0 ? "rgba(167,139,250,0.25)" : i % 3 === 1 ? "rgba(34,211,238,0.20)" : "rgba(236,72,153,0.20)"
          }`,
          animation: `particle-float ${p.duration} ease-in-out ${p.delay} infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Vignette to darken edges and focus center */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}
