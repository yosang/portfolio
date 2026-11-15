import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/portfolio";

export const alt = `${PROFILE.name} · Fullstackutvikler`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGS = ["TypeScript", "Next.js 16", "C# / .NET 9", "Node.js", "UX og design"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#17211e",
          color: "#f7f8f8",
          padding: "0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "72px 80px 68px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 22,
              color: "#9ca0a8",
              letterSpacing: "-0.01em",
            }}
          >
            <span>yosmel.no</span>
            <span>@yosang</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontSize: 76,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                color: "#f7f8f8",
              }}
            >
              {PROFILE.name}
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.4,
                color: "#c8ccd2",
                maxWidth: "900px",
              }}
            >
              Som programvareutvikler er jeg opptatt av ryddig arkitektur, tydelig design og løsninger som faktisk blir brukt.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  fontSize: 20,
                  color: "#f7f8f8",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
