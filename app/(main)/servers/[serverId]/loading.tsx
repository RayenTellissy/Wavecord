export default function ServerLoading() {
  return (
    <div className="skeleton" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Channel sidebar skeleton */}
      <div style={{
        width: 240,
        minWidth: 240,
        background: "var(--surface-1)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Server header */}
        <div style={{
          height: 49,
          borderBottom: "1px solid var(--border)",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "var(--surface-2)" }} />
          <div style={{ flex: 1, height: 14, borderRadius: 4, background: "var(--surface-2)" }} />
        </div>

        {/* Category + channels skeleton */}
        <div style={{ flex: 1, padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ width: 80, height: 10, borderRadius: 4, background: "var(--surface-2)", margin: "0.5rem 0.25rem 0.25rem" }} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 32, borderRadius: 6, background: "var(--surface-2)", opacity: 0.6 }} />
          ))}
          <div style={{ width: 60, height: 10, borderRadius: 4, background: "var(--surface-2)", margin: "0.75rem 0.25rem 0.25rem" }} />
          {[1, 2].map((i) => (
            <div key={i} style={{ height: 32, borderRadius: 6, background: "var(--surface-2)", opacity: 0.6 }} />
          ))}
        </div>
      </div>

      {/* Chat area skeleton */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "rgba(10,10,14,0.18)",
        backdropFilter: "blur(60px) saturate(2.6) brightness(1.04)",
        WebkitBackdropFilter: "blur(60px) saturate(2.6) brightness(1.04)",
        minWidth: 0,
      }}>
        <div style={{ height: 49, borderBottom: "1px solid var(--border)", flexShrink: 0 }} />
        <div style={{ flex: 1 }} />
        <div style={{ padding: "0 1rem 1rem", flexShrink: 0 }}>
          <div style={{ height: 44, borderRadius: 8, background: "var(--surface-2)" }} />
        </div>
      </div>
    </div>
  );
}
