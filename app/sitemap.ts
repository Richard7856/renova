import type { MetadataRoute } from "next";
import { clinic } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: clinic.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
