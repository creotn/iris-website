import AppConfig from "@/config/Base";
import { MetadataRoute } from "next";

const PAGES = ["privacy", "terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${AppConfig.baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          ar: `${AppConfig.baseUrl}/ar`,
          en: `${AppConfig.baseUrl}/en`,
        },
      },
    },
    ...PAGES.map((page) => ({
      url: `${AppConfig.baseUrl}/ar/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: {
        languages: {
          ar: `${AppConfig.baseUrl}/ar/${page}`,
          en: `${AppConfig.baseUrl}/en/${page}`,
        },
      },
    })),
  ];
}
