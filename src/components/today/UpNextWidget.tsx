"use client";

import Link from "next/link";
import { Fragment } from "react";

import type { UpNextItem } from "@/lib/today-data";

import { Skeleton } from "./Skeleton";

interface UpNextWidgetProps {
  items: UpNextItem[];
  now?: string;
  /**
   * Click handler for the inline CTA. Receives the event so the parent can
   * preventDefault and run an interstitial transition; the Link's `href` is
   * the canonical target.
   */
  onCheckIn?: (at: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  loading?: boolean;
}

/**
 * Vertical time-rail of upcoming events. The first row is "active" — its
 * time renders in cool-teal and a primary CTA sits inline. Subsequent
 * rows are static labels.
 *
 * Timeline structure per Figma 3:67 — each event row carries a per-row
 * connector line (`flex-1`) below the time text. Between rows there's a
 * standalone 24px spacer with the same 1px line, which is what creates
 * the visible gap between events while keeping the rail unbroken from
 * one row's connector to the next. The last row has no connector. Row
 * content has zero internal padding; all spacing is in the spacers.
 */
export function UpNextWidget({
  items,
  now = "14:07",
  onCheckIn,
  loading = false,
}: UpNextWidgetProps) {
  if (loading) {
    return (
      <div
        aria-busy
        aria-label="Loading up next"
        className="flex flex-col gap-6 rounded-md bg-surface p-4 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <Skeleton w={64} h={12} />
          <Skeleton w={104} h={12} />
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => {
            const isLast = i === 2;
            return (
              <Fragment key={i}>
                <div className="flex w-full items-stretch gap-4">
                  <div className="flex w-[42px] flex-col items-center gap-2">
                    <Skeleton w={42} h={24} />
                    {!isLast && <SolidRail />}
                  </div>
                  <div className="flex flex-1 flex-col gap-4 min-w-0">
                    {/* Skeleton heights match the loaded text's line-heights
                        (body 24, caption 18) so the card doesn't grow when
                        real text replaces the placeholders. */}
                    <div className="flex flex-col">
                      <Skeleton w="62%" h={24} />
                      <Skeleton w="48%" h={18} />
                    </div>
                    {i === 0 && <Skeleton w={120} h={40} r={6} />}
                  </div>
                </div>
                {!isLast && <RowSpacer />}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-md bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="text-[12px] font-medium leading-4 text-ink-tertiary">
          UP NEXT
        </div>
        <div className="text-[12px] leading-4 tabular-nums text-ink-secondary">
          Tuesday · {now}
        </div>
      </div>

      <div className="flex flex-col">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={i}>
              <div className="flex w-full items-stretch gap-4">
                <div className="flex w-[42px] flex-col items-center gap-2">
                  <div
                    className={`text-body font-medium tabular-nums [letter-spacing:-0.005em] ${
                      it.active ? "text-raaha-clear" : "text-ink-primary"
                    }`}
                  >
                    {it.time}
                  </div>
                  {!isLast && <SolidRail />}
                </div>
                <div className="flex flex-1 flex-col gap-4 min-w-0">
                  <div className="flex flex-col">
                    <div className="text-body text-ink-primary">{it.title}</div>
                    <div className="text-caption text-ink-secondary">
                      {it.meta}
                    </div>
                  </div>
                  {it.cta && (
                    <Link
                      href="/swipe"
                      onClick={(e) => onCheckIn?.(it.time, e)}
                      className="flex w-[120px] items-center justify-center rounded-sm bg-accent-primary px-3 py-2 text-body font-medium text-white transition-opacity hover:opacity-90"
                    >
                      {it.cta}
                    </Link>
                  )}
                </div>
              </div>
              {!isLast && <RowSpacer />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * In-row connector. Solid 1px line filling the rest of the time column
 * beneath the time label. flex-1 lets it stretch to the row's bottom.
 */
function SolidRail() {
  return <span aria-hidden className="w-px flex-1 bg-line-hairline" />;
}

/**
 * Standalone 24px-tall spacer between rows. The 1px line is centered in
 * a 42px-wide block so it aligns with the time column above and below,
 * making the rail read as continuous through the gap.
 */
function RowSpacer() {
  return (
    <div aria-hidden className="flex h-6 w-[42px] justify-center">
      <span className="w-px bg-line-hairline" />
    </div>
  );
}
