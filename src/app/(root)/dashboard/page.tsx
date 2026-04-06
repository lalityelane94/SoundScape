"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Project { _id: string; name: string; bpm: number; updatedAt: string; }

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function createProject() {
    setCreating(true);
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Untitled Beat" }) });
      const data = await res.json();
      if (data._id) router.push("/studio/" + data._id);
    } catch (err) { console.error(err); setCreating(false); }
  }

  async function deleteProject(id: string) {
    setDeletingId(id);
    try {
      await fetch("/api/projects/" + id, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0F", padding: "2rem", fontFamily: "monospace" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "white", margin: 0 }}>Sound<span style={{ color: "#6C63FF" }}>Scape</span></h1>
            <p style={{ fontSize: "0.8rem", color: "#555", marginTop: "4px" }}>Welcome back, {user?.firstName ?? "Producer"}</p>
          </div>
          <button onClick={createProject} disabled={creating} style={{ background: "#6C63FF", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", opacity: creating ? 0.5 : 1 }}>
            {creating ? "Creating..." : "+ New Beat"}
          </button>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: "4rem", color: "#555" }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "6rem", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.1rem", color: "white", margin: 0 }}>No projects yet</h2>
            <p style={{ fontSize: "0.8rem", color: "#555", margin: 0 }}>Create your first beat to get started</p>
            <button onClick={createProject} disabled={creating} style={{ background: "#6C63FF", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", marginTop: "1rem" }}>
              {creating ? "Creating..." : "Create your first beat"}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
            {projects.map((project) => (
              <div key={project._id} onClick={() => router.push("/studio/" + project._id)}
                style={{ background: "#111118", border: "1px solid #2A2A3A", borderRadius: "12px", padding: "1.25rem", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#6C63FF")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2A2A3A")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "white", margin: "0 0 6px" }}>{project.name}</h3>
                    <span style={{ fontSize: "0.7rem", color: "#6C63FF", background: "#6C63FF22", padding: "2px 8px", borderRadius: "4px" }}>{project.bpm} BPM</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteProject(project._id); }} disabled={deletingId === project._id}
                    style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "0.75rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}>
                    {deletingId === project._id ? "..." : "X"}
                  </button>
                </div>
                <div style={{ marginTop: "12px", display: "flex", gap: "3px" }}>
                  {["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#C77DFF"].map((c) => (
                    <div key={c} style={{ height: "3px", flex: 1, background: c, borderRadius: "2px", opacity: 0.6 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
