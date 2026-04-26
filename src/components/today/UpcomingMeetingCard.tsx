"use client";

import Link from "next/link";

interface UpcomingMeetingCardProps {
  minutesUntil?: number;
  title?: string;
  location?: string;
  /**
   * Click handler. Receives the click event so the parent can preventDefault
   * and run an interstitial transition before navigation. The Link's `href`
   * is the canonical target — preventDefault opts out of automatic routing.
   */
  onCheckIn?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Top-of-stack notification banner for the next meeting. Lives at the top
 * of the Home / Today screen and is mounted only after the rest of the
 * stack has loaded — see HomeToday for the entry animation.
 *
 * Visual treatment is the inverse of the other cards (soft accent fill +
 * primary border) so the eye lands here first when it appears.
 */
export function UpcomingMeetingCard({
  minutesUntil = 12,
  title = "1:1 / Ahmad",
  location = "Microsoft Teams",
  onCheckIn,
}: UpcomingMeetingCardProps) {
  return (
    <div
      role="region"
      aria-label="Upcoming meeting"
      className="rounded-md border border-accent-primary bg-accent-primary-soft p-4 shadow-sm"
    >
      {/* The "minutes" warning uses raaha-tight (warm-tight) — same hue as
          the gauge's left edge, signalling closeness without alarm. */}
      <div className="mb-1 text-micro font-medium tabular-nums text-raaha-tight">
        In {minutesUntil} minutes
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-body text-ink-primary">{title}</div>
          <div className="text-caption text-ink-secondary">{location}</div>
        </div>
        <Link
          href="/swipe"
          onClick={onCheckIn}
          className="flex w-[120px] flex-shrink-0 items-center justify-center whitespace-nowrap rounded-sm bg-accent-primary px-3 py-2 text-body font-medium text-white transition-opacity hover:opacity-90"
        >
          Check in
        </Link>
      </div>
    </div>
  );
}
