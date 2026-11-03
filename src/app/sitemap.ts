import AppConfig from "@/config/Base";
import { MetadataRoute } from "next";

const LOCALES = ["ar", "en"] as const;

// Every page is listed once per language, each pointing at its other-language twin.
const PAGES: { path: string; changeFrequency: "daily" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: `${AppConfig.baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ar: `${AppConfig.baseUrl}/ar${path}`,
          en: `${AppConfig.baseUrl}/en${path}`,
        },
      },
    })),
  );
}
