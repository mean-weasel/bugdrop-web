import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BugDrop - In-app feedback to GitHub Issues";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1a1b26",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradients */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255,158,100,0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(125,207,255,0.08) 0%, transparent 50%)",
          }}
        />

        {/* Bug emoji */}
        <div style={{ fontSize: 72, marginBottom: 16, display: "flex" }}>
          🐛
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#c0caf5",
            marginBottom: 12,
            display: "flex",
          }}
        >
          BugDrop
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#787c99",
            marginBottom: 32,
            display: "flex",
          }}
        >
          In-app feedback → GitHub Issues
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Screenshots", "Annotations", "System Info"].map((label) => (
            <div
              key={label}
              style={{
                background: "#24283b",
                border: "1px solid #3b4261",
                borderRadius: 24,
                padding: "10px 24px",
                color: "#ff9e64",
                fontSize: 20,
                fontWeight: 500,
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 20,
            color: "#565f89",
            display: "flex",
          }}
        >
          bugdrop.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
