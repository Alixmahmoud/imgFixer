import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fafafa"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: 24 }}
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l3 3 3-3" />
          <path d="M12 18v-6" />
        </svg>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          ImgFixer
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Free Online Image Tools — Compress, Resize, Convert &amp; More
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
