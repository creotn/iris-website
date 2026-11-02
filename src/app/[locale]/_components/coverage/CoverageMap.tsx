"use client";

import dynamic from "next/dynamic";
import type { MapProps } from "./markup";

const GoogleCoverageMap = dynamic(() => import("./GoogleCoverageMap"), { ssr: false });

export default function CoverageMap(props: MapProps) {
    return <GoogleCoverageMap {...props} />;
}
