/**
 * Mock data for the Home / Today screen.
 *
 * TODO(real-data): replace these statics with calendar + loops backends
 * when the data layer lands. The component contracts (LoopDay, UpNextItem)
 * are stable; only the source needs to swap.
 */

/**
 * A loop is either productivity (work-shaped) or wellbeing (self-shaped).
 * The internal kind is kept as "op" (operational) for back-compat with the
 * data layer; the displayed legend label is "Productivity" per Figma 0:99.
 */
export type LoopKind = "op" | "wb";

export interface LoopDay {
  /** Two-letter weekday label, e.g. "Tu". */
  day: string;
  /** Up to 4 dots are rendered per cell — extras are dropped. */
  dots: LoopKind[];
  /** Marks the rightmost cell with the green accent treatment. */
  today?: boolean;
}

export interface UpNextItem {
  time: string;
  title: string;
  meta: string;
  /** Optional inline call-to-action label; when present a button renders. */
  cta?: string;
  /** First-up event renders its time in cool teal and exposes the CTA. */
  active?: boolean;
}

/**
 * 11 cells: 10 past working days + today (Tuesday). Mirrors the Figma
 * design at node 3:2 of the Raaha file (mock distribution — real data
 * will come from the loops backend).
 */
export const LOOPS_11: LoopDay[] = [
  { day: "Tu", dots: ["op", "wb", "wb", "op"] },
  { day: "We", dots: ["op", "wb", "wb"] },
  { day: "Th", dots: ["wb", "wb"] },
  { day: "Fr", dots: ["op", "wb", "wb"] },
  { day: "Mo", dots: [] },
  { day: "Tu", dots: [] },
  { day: "We", dots: ["op", "wb", "wb"] },
  { day: "Th", dots: ["wb", "wb"] },
  { day: "Fr", dots: [] },
  { day: "Mo", dots: ["op", "wb", "wb", "op"] },
  { day: "Tu", dots: ["wb", "wb", "op"], today: true },
];

export const UP_NEXT: UpNextItem[] = [
  {
    time: "14:30",
    title: "1:1 / Ahmad",
    meta: "Microsoft Teams · 30 min",
    cta: "Check in",
    active: true,
  },
  { time: "15:00", title: "1:1 / Mira", meta: "Microsoft Teams · 30 min" },
  {
    time: "15:30",
    title: "Procurement Planning",
    meta: "Microsoft Teams · 30 min",
  },
];
