import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://Slonik01.github.io/kindergarten-marketing-v2";
  return {
    rules: { userAgent: "*", allow: "/kindergarten-marketing-v2/" },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
