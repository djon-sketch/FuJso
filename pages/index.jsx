import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [converted, setConverted] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) return alert("Masukkan HTML terlebih dahulu!");
    const encoded = btoa(unescape(encodeURIComponent(input)));
    setConverted(encoded);
    setShowOverlay(true);
  };

  const handleSubmit = async () => {
    setUploading(true);
    const id = Math.random().toString(36).substring(2, 10);
    const res = await fetch(`/api/save?id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: converted }),
    });
    if (res.ok) {
      const rawURL = `${window.location.origin}/raw/${id}`;
      await navigator.clipboard.writeText(rawURL);
      window.location.href = rawURL;
    } else {
      alert("Gagal menyimpan data!");
    }
  };

  return (
    <main
      style={{
        fontFamily: "monospace",
        background: "#000",
        color: "#0f0",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem" }}>
        HTML Encryptor (JavaScript Overlay)
      </h1>

      {!showOverlay ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tempel HTML kamu di sini..."
            style={{
              width: "100%",
              height: "300px",
              background: "#0a0a0a",
              color: "#0f0",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "1rem",
              fontSize: "14px",
              resize: "none",
              outline: "none",
            }}
          />
          <button
            onClick={handleConvert}
            style={{
              padding: "1rem",
              fontSize: "1rem",
              background: "#0f0",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Convert!
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            id="matrix"
            style={{
              position: "relative",
              width: "100%",
              height: "250px",
              background: "#000",
              overflow: "hidden",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <canvas id="overlayCanvas" width="800" height="250"></canvas>
          </div>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            style={{
              padding: "1rem",
              fontSize: "1rem",
              background: uploading ? "#555" : "#0f0",
              color: "#000",
              border: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Submitting..." : "Submit"}
          </button>

          <script
            dangerouslySetInnerHTML={{
              __html: `
              const canvas = document.getElementById("overlayCanvas");
              const ctx = canvas.getContext("2d");
              const w = canvas.width, h = canvas.height;
              const cols = Math.floor(w / 15) + 1;
              const ypos = Array(cols).fill(0);
              ctx.fillStyle = "#000";
              ctx.fillRect(0, 0, w, h);
              function matrix() {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#0f0";
                ctx.font = "15pt monospace";
                ypos.forEach((y, ind) => {
                  const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                  const x = ind * 15;
                  ctx.fillText(text, x, y);
                  if (y > h + Math.random() * 10000) ypos[ind] = 0;
                  else ypos[ind] = y + 15;
                });
              }
              setInterval(matrix, 50);
            `,
            }}
          />
        </div>
      )}
    </main>
  );
                                  }
