export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(29,78,216,0.13) 0%, transparent 65%), var(--bg)",
      padding: "1rem",
    }}>
      {children}
    </div>
  );
}
