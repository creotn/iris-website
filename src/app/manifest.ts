import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IRIS",
    short_name: "IRIS",
    description: "IRIS",
    start_url: "/",
    orientation: "any",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f2937",
  };
}
