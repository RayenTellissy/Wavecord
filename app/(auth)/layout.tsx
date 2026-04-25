export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `
        radial-gradient(ellipse 80% 55% at 50% -5%, rgba(139,92,246,0.12) 0%, transparent 65%),
        radial-gradient(ellipse 55% 40% at 90% 90%, rgba(34,211,238,0.06) 0%, transparent 55%),
        #0a0a0f
      `,
      padding: "1rem",
    }}>
      {children}
    </div>
  );
}
