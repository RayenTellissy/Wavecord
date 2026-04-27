export default function ConversationsLoading() {
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div style={{
        width: 240,
        minWidth: 240,
        background: "rgba(12,12,16,0.24)",
        backdropFilter: "blur(80px) saturate(3) brightness(1.06)",
        WebkitBackdropFilter: "blur(80px) saturate(3) brightness(1.06)",
        borderRight: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "inset -1px 0 0 rgba(139,92,246,0.12), inset 0 2px 0 rgba(255,255,255,0.14), 4px 0 40px rgba(0,0,0,0.45)",
      }}>
        <div style={{
          padding: "0.9rem 1rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{
            width: 120,
            height: 14,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: "rgba(255,255,255,0.06)",
          }} />
        </div>

        <div style={{ flex: 1, padding: "0.5rem 0" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.5rem 0.4rem 0.75rem",
              margin: "0.05rem 0.5rem",
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                flexShrink: 0,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }} />
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{
                  width: `${55 + (i % 3) * 15}%`,
                  height: 11,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.08)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }} />
                <div style={{
                  width: `${40 + (i % 4) * 10}%`,
                  height: 9,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.12}s`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: "var(--bg)" }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
