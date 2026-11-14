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
          backgroundColor: "#141517",
          backgroundImage:
            "radial-gradient(circle at 16% 18%, rgba(228, 70, 31, 0.22), transparent 48%), radial-gradient(circle at 86% 20%, rgba(128, 201, 255, 0.14), transparent 50%)",
          color: "#f3f2ee",
          padding: "0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "6px",
            background:
              "linear-gradient(90deg, #141517 0%, #fbc017 24%, #e4461f 52%, #80c9ff 78%, #141517 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "68px 80px 64px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 22,
              color: "#969ca6",
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
                color: "#f3f2ee",
              }}
            >
              {PROFILE.name}
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.4,
                color: "#c5c8ce",
                maxWidth: "900px",
              }}
            >
              Fullstackutvikler med fokus på struktur, UX og programvare som faktisk blir brukt.
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
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  fontSize: 20,
                  color: "#e5e4df",
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
