import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { ImageResponse } from "next/og";

export const alt = "Impossible Queries";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load Barlow (colocated OFL font) so the image matches the site type.
  const [barlowRegular, barlowBold] = await Promise.all([
    readFile(fileURLToPath(new URL("./Barlow-Regular.ttf", import.meta.url))),
    readFile(fileURLToPath(new URL("./Barlow-Bold.ttf", import.meta.url))),
  ]);

  const logo = await readFile(
    fileURLToPath(new URL("./logo.svg", import.meta.url)),
  );
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  let question = "Bar debates for the ungoogleable.";
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createClient(url, key);
      const { data } = await supabase
        .from("questions")
        .select("question")
        .eq("id", id)
        .maybeSingle();
      if (data?.question) question = data.question;
    }
  } catch {
    // fall back to the default tagline
  }
  const text = question.length > 160 ? `${question.slice(0, 157)}…` : question;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#01161e",
        color: "#ffffff",
        padding: 80,
        fontFamily: "Barlow",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* biome-ignore lint/performance/noImgElement: next/og (Satori) requires a plain <img>, not next/image */}
        <img src={logoSrc} width={40} height={52} alt="" />
        <span style={{ fontSize: 34, fontWeight: 700, color: "#7ac0e7" }}>
          Impossible Queries
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.15,
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
          fontWeight: 400,
          color: "#65a6c9",
        }}
      >
        Cast your vote →
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Barlow", data: barlowRegular, weight: 400, style: "normal" },
        { name: "Barlow", data: barlowBold, weight: 700, style: "normal" },
      ],
    },
  );
}
