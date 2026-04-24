export default function ConversationsEmptyPage() {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface-1)",
      color: "var(--text-secondary)",
      gap: "0.75rem",
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "var(--surface-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
        Your Direct Messages
      </h2>
      <p style={{ fontSize: "0.9rem", maxWidth: 300, textAlign: "center", lineHeight: 1.6 }}>
        Select a conversation from the sidebar or click <strong>+</strong> to start a new one.
      </p>
    </div>
  );
}
