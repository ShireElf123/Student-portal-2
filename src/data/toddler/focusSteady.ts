/** Slow-finger lanes — stay in the gold. Hit the red edge and it buzzes. Not letter tracing. */

export type Point = { x: number; y: number };

export interface SteadyTrack {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  lane: number;
  maxSpeed: number;
  points: Point[];
}

function curve(steps: number, fn: (t: number) => Point): Point[] {
  return Array.from({ length: steps }, (_, i) => fn(i / (steps - 1)));
}

export const STEADY_TRACKS: SteadyTrack[] = [
  {
    id: "hill",
    emoji: "⛰️",
    title: "Little hill",
    spoken: "Start on green. Stay in the gold. Slow over the hill.",
    lane: 13,
    maxSpeed: 0.28,
    points: [
      { x: 8, y: 78 },
      { x: 22, y: 62 },
      { x: 38, y: 36 },
      { x: 50, y: 28 },
      { x: 62, y: 36 },
      { x: 78, y: 62 },
      { x: 92, y: 78 },
    ],
  },
  {
    id: "river",
    emoji: "🌊",
    title: "River S",
    spoken: "Follow the river. Soft and slow.",
    lane: 12,
    maxSpeed: 0.24,
    points: [
      { x: 12, y: 18 },
      { x: 28, y: 18 },
      { x: 40, y: 28 },
      { x: 42, y: 48 },
      { x: 52, y: 68 },
      { x: 70, y: 80 },
      { x: 88, y: 80 },
    ],
  },
  {
    id: "snail",
    emoji: "🐌",
    title: "Snail",
    spoken: "Curl like a snail. Do not rush.",
    lane: 12,
    maxSpeed: 0.22,
    points: curve(40, (t) => {
      const ang = t * Math.PI * 2.4;
      const r = 8 + t * 28;
      return { x: 52 + Math.cos(ang) * r, y: 52 + Math.sin(ang) * r };
    }),
  },
  {
    id: "rainbow",
    emoji: "🌈",
    title: "Rainbow",
    spoken: "Over the rainbow. Slow finger.",
    lane: 12,
    maxSpeed: 0.24,
    points: curve(24, (t) => ({
      x: 10 + t * 80,
      y: 78 - Math.sin(t * Math.PI) * 52,
    })),
  },
  {
    id: "bridge",
    emoji: "🌉",
    title: "Bridge",
    spoken: "Across the bridge. Stay on the gold.",
    lane: 11,
    maxSpeed: 0.22,
    points: [
      { x: 8, y: 72 },
      { x: 20, y: 72 },
      { x: 28, y: 48 },
      { x: 40, y: 32 },
      { x: 50, y: 28 },
      { x: 60, y: 32 },
      { x: 72, y: 48 },
      { x: 80, y: 72 },
      { x: 92, y: 72 },
    ],
  },
  {
    id: "zigzag",
    emoji: "⚡",
    title: "Zigzag",
    spoken: "Corners are slow. Do not fly.",
    lane: 10,
    maxSpeed: 0.2,
    points: [
      { x: 10, y: 82 },
      { x: 24, y: 22 },
      { x: 38, y: 82 },
      { x: 52, y: 22 },
      { x: 66, y: 82 },
      { x: 80, y: 22 },
      { x: 92, y: 70 },
    ],
  },
  {
    id: "vine",
    emoji: "🌿",
    title: "Vine",
    spoken: "Up the vine. Tiny steps.",
    lane: 10,
    maxSpeed: 0.2,
    points: curve(28, (t) => ({
      x: 50 + Math.sin(t * Math.PI * 3) * 28,
      y: 88 - t * 72,
    })),
  },
  {
    id: "heart",
    emoji: "💛",
    title: "Heart",
    spoken: "Around the heart. Stay inside the gold.",
    lane: 10,
    maxSpeed: 0.2,
    points: curve(36, (t) => {
      const a = Math.PI * 2 * t;
      const x = 16 * Math.sin(a) ** 3;
      const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
      return { x: 50 + x * 2.1, y: 48 - y * 2.1 };
    }),
  },
  {
    id: "loop",
    emoji: "🎢",
    title: "Loop",
    spoken: "Around the loop, then to the star.",
    lane: 9,
    maxSpeed: 0.18,
    points: [
      { x: 10, y: 78 },
      { x: 22, y: 70 },
      { x: 30, y: 48 },
      { x: 42, y: 28 },
      { x: 62, y: 22 },
      { x: 78, y: 34 },
      { x: 82, y: 52 },
      { x: 70, y: 66 },
      { x: 50, y: 64 },
      { x: 40, y: 50 },
      { x: 48, y: 36 },
      { x: 68, y: 32 },
      { x: 86, y: 22 },
    ],
  },
  {
    id: "u-turns",
    emoji: "↩️",
    title: "U turns",
    spoken: "Turn, wait, turn. Slow on the corners.",
    lane: 9,
    maxSpeed: 0.18,
    points: [
      { x: 12, y: 88 },
      { x: 12, y: 18 },
      { x: 38, y: 18 },
      { x: 38, y: 78 },
      { x: 64, y: 78 },
      { x: 64, y: 18 },
      { x: 88, y: 18 },
      { x: 88, y: 72 },
    ],
  },
  {
    id: "knot",
    emoji: "➰",
    title: "Pretend knot",
    spoken: "Through the knot. Tiny and slow.",
    lane: 8,
    maxSpeed: 0.16,
    points: curve(42, (t) => {
      const a = t * Math.PI * 2;
      return {
        x: 50 + Math.sin(a) * 32 + Math.sin(a * 2) * 8,
        y: 50 + Math.sin(a * 2) * 22,
      };
    }),
  },
  {
    id: "star-path",
    emoji: "⭐",
    title: "Star walk",
    spoken: "Five points. Pause at each tip.",
    lane: 8,
    maxSpeed: 0.16,
    points: (() => {
      const pts: Point[] = [];
      for (let i = 0; i <= 5; i += 1) {
        const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
        pts.push({ x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 36 });
      }
      return pts;
    })(),
  },
];

export function pathToD(points: Point[]): string {
  if (!points.length) return "";
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

export function resamplePath(points: Point[], spacing = 1.6): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return [points[0]];
  const out: Point[] = [{ ...points[0] }];
  let carry = 0;
  for (let i = 1; i < points.length; i += 1) {
    let x0 = points[i - 1].x;
    let y0 = points[i - 1].y;
    const x1 = points[i].x;
    const y1 = points[i].y;
    let remaining = Math.hypot(x1 - x0, y1 - y0);
    if (remaining === 0) continue;
    while (carry + remaining >= spacing) {
      const t = (spacing - carry) / remaining;
      x0 += (x1 - x0) * t;
      y0 += (y1 - y0) * t;
      out.push({ x: x0, y: y0 });
      remaining = Math.hypot(x1 - x0, y1 - y0);
      carry = 0;
    }
    carry += remaining;
  }
  const last = points[points.length - 1];
  const tail = out[out.length - 1];
  if (!tail || Math.hypot(tail.x - last.x, tail.y - last.y) > 0.4) out.push({ ...last });
  return out;
}

export type LaneResult = "need-start" | "ok" | "off" | "fast" | "skip" | "win";

export function nearestOnPath(samples: Point[], finger: Point): { index: number; dist: number } {
  let best = 0;
  let bestD = Number.POSITIVE_INFINITY;
  for (let i = 0; i < samples.length; i += 1) {
    const sample = samples[i];
    const dist = Math.hypot(sample.x - finger.x, sample.y - finger.y);
    if (dist < bestD) {
      bestD = dist;
      best = i;
    }
  }
  return { index: best, dist: bestD };
}

export function stepSteadyLane(input: {
  samples: Point[];
  along: number;
  finger: Point;
  started: boolean;
  lane: number;
  lookahead: number;
  lastFinger: Point | null;
  dtMs: number;
  maxSpeed: number;
}): { along: number; result: LaneResult } {
  const { samples, finger, started, lane, lookahead, lastFinger, dtMs, maxSpeed } = input;
  if (!samples.length) return { along: 0, result: "off" };
  const start = samples[0];
  const end = samples[samples.length - 1];
  if (!started) {
    const dist = Math.hypot(finger.x - start.x, finger.y - start.y);
    if (dist <= lane + 4) return { along: 0, result: "ok" };
    return { along: 0, result: "need-start" };
  }
  if (lastFinger && dtMs > 0) {
    const speed = Math.hypot(finger.x - lastFinger.x, finger.y - lastFinger.y) / dtMs;
    if (speed > maxSpeed) return { along: input.along, result: "fast" };
  }
  const hit = nearestOnPath(samples, finger);
  if (hit.dist > lane) return { along: input.along, result: "off" };
  if (hit.index > input.along + lookahead) return { along: input.along, result: "skip" };
  const along = Math.max(input.along, hit.index);
  const endDist = Math.hypot(finger.x - end.x, finger.y - end.y);
  if (along >= Math.floor((samples.length - 1) * 0.9) && endDist <= lane + 3) {
    return { along, result: "win" };
  }
  return { along, result: "ok" };
}
