"use client";

import Link from "next/link";

import { Skeleton } from "./Skeleton";

interface ReadingHeroProps {
  headline?: string;
  voice?: string;
  /** CTA text on the inline primary button. */
  ctaLabel?: string;
  /**
   * Click handler for the inline primary CTA. Receives the event so the
   * parent can preventDefault and run an interstitial transition; the
   * Link's `href` is the canonical target.
   */
  onCheckIn?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  loading?: boolean;
  /**
   * Visual register of the gauge. "busy" sits the needle just past
   * centre on the warm-to-cool arc (default — the day is still in
   * motion). "settled" tips it further into the green / cool side
   * after the user has created space via a successful check-in.
   * Per Figma 8:30 vs 0:34.
   */
  mood?: "busy" | "settled";
}

/**
 * Gauge-needle endpoints in the SVG's 62×36 viewBox. Both start at
 * (31, 31) — the bottom-centre pivot. The "busy" position matches the
 * pre-check-in design; "settled" matches Figma 8:33 (further right,
 * more horizontal — needle parked deep in the cool/green section).
 */
const NEEDLE_BY_MOOD = {
  busy: { x: 44, y: 11 },
  settled: { x: 52, y: 22 },
} as const;

/**
 * Qualitative summary of "today" — headline + voice line + a primary
 * CTA that initiates the check-in. Per Figma 0:26 the card carries
 * gap-4 between the (eyebrow + headline + voice) inner block and the
 * full-width primary button at the bottom.
 *
 * The headline carries the diagnosis; the small gauge glyph stays as a
 * visual anchor (warm-tight → cool-clear gradient).
 */
export function ReadingHero({
  headline = "Steady, but getting busier",
  voice = "Take a moment for yourself",
  ctaLabel = "Check in",
  onCheckIn,
  loading = false,
  mood = "busy",
}: ReadingHeroProps) {
  const needle = NEEDLE_BY_MOOD[mood];
  // Card chrome shifts in the settled state per Figma 8:22 — soft mint
  // fill + accent-primary hairline. The mint hex is intentionally off-
  // token (no `accent.primary.faint` in the system yet); slot for one
  // when there's a second use-site.
  const cardClassName =
    mood === "settled"
      ? "flex flex-col gap-4 rounded-md border border-accent-primary bg-[rgba(155,243,222,0.36)] p-4 shadow-sm"
      : "flex flex-col gap-4 rounded-md bg-surface p-4 shadow-sm";
  if (loading) {
    return (
      <div
        aria-busy
        aria-label="Loading today's reading"
        className="flex flex-col gap-4 rounded-md bg-surface p-4 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <Skeleton w={64} h={12} />
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 flex-col gap-[6px]">
              <Skeleton w="80%" h={28} />
              <Skeleton w="55%" h={28} />
            </div>
            <Skeleton w={124} h={66} r={66} />
          </div>
          <Skeleton w={172} h={20} />
        </div>
        {/* Skeleton for the full-width primary CTA below the reading. */}
        <Skeleton w="100%" h={40} r={6} />
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      <div className="flex flex-col gap-2">
        <div className="text-[12px] font-medium leading-4 text-ink-tertiary">
          TODAY IS:
        </div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 max-w-[200px] flex-1 text-[24px] font-medium leading-[28px] tracking-tight text-ink-primary [text-wrap:pretty]">
            {headline}
          </h2>
          {/* Inline SVG keeps the gradient + needle cleanly in one place;
              no asset to ship, scales perfectly. */}
          <svg
            aria-hidden
            viewBox="0 0 62 36"
            className="h-auto w-[124px] flex-shrink-0"
          >
            <defs>
              <linearGradient id="raaha-reading-gauge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C17A3E" />
                <stop offset="50%" stopColor="#D9B07C" />
                <stop offset="100%" stopColor="#7FA89E" />
              </linearGradient>
            </defs>
            <path
              d="M 6 31 A 25 25 0 0 1 56 31"
              fill="none"
              stroke="url(#raaha-reading-gauge)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Needle endpoint depends on mood — see NEEDLE_BY_MOOD above. */}
            <line
              x1="31"
              y1="31"
              x2={needle.x}
              y2={needle.y}
              stroke="#1C1A16"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="31" cy="31" r="2" fill="#1C1A16" />
          </svg>
        </div>
        <p className="m-0 text-[14px] leading-[20px] text-accent-primary">
          {voice}
        </p>
      </div>

      {/* Primary CTA — full-width, opens the swipe flow. Same routing as
          the other Check-in CTAs on Today; SwipeTransition handles the
          interstitial when the parent provides onCheckIn. */}
      <Link
        href="/swipe"
        onClick={onCheckIn}
        className="flex w-full items-center justify-center rounded-sm bg-accent-primary px-3 py-2 text-body font-medium text-white transition-opacity hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
