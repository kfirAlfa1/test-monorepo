import { useEffect, useState, type CSSProperties } from "react";

type ApiState =
  | { status: "loading" }
  | { status: "ok"; message: string }
  | { status: "error"; error: string };

const App = () => {
  const [api, setApi] = useState<ApiState>({ status: "loading" });

  useEffect(() => {
    fetch("/api/message")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { message: string } = await res.json();
        setApi({ status: "ok", message: data.message });
      })
      .catch((err: Error) => setApi({ status: "error", error: err.message }));
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Monorepo Test</h1>
        <p style={styles.subtitle}>apps/web (Vite + React) → apps/api (FastAPI)</p>
        {api.status === "loading" && <div style={{ ...styles.badge, ...styles.loading }}>Checking API…</div>}
        {api.status === "ok" && (
          <div style={{ ...styles.badge, ...styles.ok }}>API connected: {api.message}</div>
        )}
        {api.status === "error" && (
          <div style={{ ...styles.badge, ...styles.error }}>API not reachable ({api.error})</div>
        )}
      </div>
    </main>
  );
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    fontFamily: "system-ui, sans-serif",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: { margin: "0 0 8px", fontSize: 24, color: "#0f172a" },
  subtitle: { margin: "0 0 24px", color: "#64748b", fontSize: 14 },
  badge: { borderRadius: 8, padding: "12px 16px", fontSize: 14 },
  loading: { background: "#f1f5f9", color: "#475569" },
  ok: { background: "#ecfdf5", color: "#047857" },
  error: { background: "#fef2f2", color: "#b91c1c" },
};

export default App;
