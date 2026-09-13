import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://Slonik01.github.io/kindergarten-marketing-v2/";
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
  ];
}
