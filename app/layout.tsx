import type { Metadata, Viewport } from "next";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/onest/600.css";
import "@fontsource/onest/700.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "./globals.css";
import "./offer-v3.css";

const siteUrl = "https://Slonik01.github.io/kindergarten-marketing-v2";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "МАРКЕТИНГ",
  icons: { icon: "/kindergarten-marketing-v2/icon.svg" },
  title: "Дозагрузка детских садов в Астане и Алматы — МАРКЕТИНГ",
  description:
    "Система привлечения родителей через Facebook и Instagram в Астане и Алматы, которая приводит семьи, подходящие по бюджету и готовые прийти на экскурсию.",
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    title: "Дозаполните группы в детском саду",
    description:
      "Астана и Алматы. От 2,7 до 36 млн ₸ потенциальной выручки за 6–24 месяца при заполнении 3–10 мест и чеке 150 000 ₸.",
    type: "website",
    locale: "ru_RU",
    siteName: "МАРКЕТИНГ",
    url: `${siteUrl}/`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1672,
        height: 941,
        alt: "Дозагрузка детских садов в Астане и Алматы",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Дозагрузка детских садов — Астана и Алматы",
    description: "Система привлечения родителей: от рекламы до экскурсии, договора и ребёнка в группе.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        alt: "Дозагрузка детских садов в Астане и Алматы",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
