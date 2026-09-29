import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/data/site";

export const alt = `${siteConfig.brand}: AI agents, workflow automation and custom software`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for social links, generated once at build time. */
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo-full.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(900px 600px at 90% -10%, rgba(92,225,230,0.22), transparent 70%), #040a10",
          color: "#e9f3f6",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={logoSrc} width={291} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 960,
            }}
          >
            AI agents, workflow automation & custom software
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#8ea4b0" }}>
            Turning manual work into intelligent systems.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.2em",
            color: "#5ce1e6",
          }}
        >
          {siteConfig.promise.toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
