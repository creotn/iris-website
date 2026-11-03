export type MascotPose = "peek" | "sparkle" | "thumbsUp" | "chill" | "search" | "dash";

export const mascotPoses: Record<MascotPose, { src: string; w: number; h: number }> = {
  peek: { src: "/brand/mascot/peek.svg", w: 151, h: 94 },
  sparkle: { src: "/brand/mascot/sparkle.svg", w: 165, h: 101 },
  thumbsUp: { src: "/brand/mascot/thumbs-up.svg", w: 143, h: 116 },
  chill: { src: "/brand/mascot/chill.svg", w: 167, h: 106 },
  search: { src: "/brand/mascot/search.svg", w: 135, h: 118 },
  dash: { src: "/brand/mascot/dash.svg", w: 171, h: 91 },
};

export const idleSequence: MascotPose[] = ["peek", "sparkle", "search", "chill"];

export const MASCOT_EVENT = "iris-mascot";
export type MascotEventDetail = { pose: MascotPose; fly?: boolean };
