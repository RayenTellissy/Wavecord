export default function ConversationLoading() {
  return (
    <div className="skeleton" style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "rgba(10,10,14,0.18)",
      backdropFilter: "blur(60px) saturate(2.6) brightness(1.04)",
      WebkitBackdropFilter: "blur(60px) saturate(2.6) brightness(1.04)",
      minWidth: 0,
      overflow: "hidden",
    }}>
      {/* Header skeleton */}
      <div style={{
        height: 49,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        gap: "0.5rem",
        flexShrink: 0,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface-2)" }} />
        <div style={{ width: 100, height: 14, borderRadius: 4, background: "var(--surface-2)" }} />
      </div>

      {/* Messages skeleton */}
      <div style={{ flex: 1, padding: "1rem 1rem 0", display: "flex", flexDirection: "column", gap: "1.25rem", overflow: "hidden" }}>
        {[100, 160, 80, 220, 110, 140].map((w, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-2)", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ width: 80, height: 11, borderRadius: 4, background: "var(--surface-2)" }} />
              <div style={{ width: w, height: 13, borderRadius: 4, background: "var(--surface-2)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Input skeleton */}
      <div style={{ padding: "0 1rem 1rem", flexShrink: 0 }}>
        <div style={{ height: 44, borderRadius: 8, background: "var(--surface-2)" }} />
      </div>
    </div>
  );
}
