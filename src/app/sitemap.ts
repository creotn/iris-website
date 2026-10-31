import AppConfig from "@/config/Base";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["ar", "en"].map((locale) => ({
    url: `${AppConfig.baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
    alternates: {
      languages: {
        ar: `${AppConfig.baseUrl}/ar`,
        en: `${AppConfig.baseUrl}/en`,
      },
    },
  }));
}
