import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/portfolio";

export const alt = `${PROFILE.name} · Fullstackutvikler`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGS = ["TypeScript", "Next.js 16", "C# / .NET 9", "Node.js", "UX og design"];

export default function OpenGraphImage() {
  const avatarBuf = readFileSync(
    join(process.cwd(), "public", "avatar", "og-avatar.png")
  );
  const avatarDataUrl = `data:image/png;base64,${avatarBuf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          backgroundColor: "#17211e",
          color: "#f7f8f8",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: 22,
              color: "#9ca0a8",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: "#f7f8f8", fontWeight: 600 }}>yosmel.no</span>
            <span>·</span>
            <span>@yosang</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontSize: 68,
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
                fontSize: 27,
                lineHeight: 1.42,
                color: "#c8ccd2",
                maxWidth: "690px",
              }}
            >
              Jeg utvikler nettsider og systemer med fokus på ryddig arkitektur, tydelig design og løsninger som folk faktisk tar i bruk.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "9px 18px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  fontSize: 18,
                  color: "#f7f8f8",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: "300px",
            height: "502px",
            display: "flex",
            flexDirection: "column",
            borderRadius: "22px",
            backgroundColor: "#141d1a",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            overflow: "hidden",
            boxShadow: "0 20px 44px rgba(6, 10, 8, 0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: 14,
              color: "#9ca0a8",
            }}
          >
            <span style={{ color: "#f7f8f8", fontWeight: 600 }}>AI Yosmel</span>
            <span>klar</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarDataUrl}
            alt="AI Yosmel"
            width={300}
            height={456}
            style={{
              width: "300px",
              height: "456px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
