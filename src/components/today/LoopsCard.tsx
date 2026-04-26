"use client";

import { useState } from "react";

import type { LoopDay } from "@/lib/today-data";

import { LoopsInfoSheet } from "./LoopsInfoSheet";
import { Skeleton } from "./Skeleton";

interface LoopsCardProps {
  days: LoopDay[];
  loading?: boolean;
}

/**
 * 11-cell strip — 10 past working days + today. Today's column gets the
 * primary-green outline + soft fill; everything else sits on a faint
 * ink-tinted surface. Two dot shapes carry the type:
 *
 *   op (productivity) → warm-mid hollow diamond
 *   wb (wellbeing)    → cool-teal filled circle
 *
 * The diamond is just a 6×6 square rotated 45° — keeps it geometric and
 * inherits from the same border colour as the legend swatch.
 *
 * Internal type values stay as "op"/"wb" for data-layer back-compat; the
 * legend's displayed label for "op" is "Productivity" per Figma 0:99.
 */
export function LoopsCard({ days, loading = false }: LoopsCardProps) {
  // Local sheet state — the LoopsCard owns the explainer drawer because
  // it's the only trigger surface. If a future screen needs the same
  // sheet from a different surface, lift this state up.
  const [sheetOpen, setSheetOpen] = useState(false);

  if (loading) {
    return (
      <div
        aria-busy
        aria-label="Loading closed loops"
        className="rounded-md bg-surface px-4 pb-6 pt-4 shadow-sm"
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <Skeleton w={104} h={12} />
            <Skeleton w={72} h={12} />
          </div>
          <Skeleton w={64} h={12} />
        </div>
        <div className="grid grid-cols-[repeat(11,24px)] justify-between">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton key={i} w={24} h={44} r={6} />
          ))}
        </div>
        <div className="mt-[6px] grid grid-cols-[repeat(11,24px)] justify-between">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton key={i} w={14} h={8} className="mx-auto" />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Skeleton w={88} h={14} />
          <Skeleton w={76} h={14} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Card is a button — tapping anywhere on the surface opens the
          loops explainer sheet. text-left keeps default <button> centring
          from clobbering the inner content alignment. The "Learn More"
          affordance is a styled span (not a nested button) so the
          whole-card tap target stays valid HTML on mobile. */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        className="block w-full rounded-md bg-surface px-4 pb-6 pt-4 text-left shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-[12px] font-medium leading-4 text-ink-tertiary">
              LOOPS CLOSED
            </div>
            {/* Subtitle uses the cooler / lighter neutral grey from Figma
                0:43 (#acacac) — explicitly off-token so the visual
                hierarchy reads as: tertiary (warm) heading → quaternary
                (cool, even lighter) subtitle. If a `ink.faint` token
                lands later, swap this. */}
            <div className="text-[12px] leading-4 text-[#acacac]">
              Last 10 days
            </div>
          </div>
          <span className="text-[12px] font-medium leading-4 text-accent-primary">
            Learn More
          </span>
        </div>

        {/* Cell row: fixed 24px columns spread across the card width. Each
            cell holds up to four dots, stacked bottom-up via column-reverse
            so a single dot sits at the bottom of an otherwise-empty cell. */}
        <div className="grid grid-cols-[repeat(11,24px)] justify-between">
          {days.map((d, i) => (
            <LoopCell key={i} day={d} />
          ))}
        </div>

        <div className="mt-[6px] grid grid-cols-[repeat(11,24px)] justify-between">
          {days.map((d, i) => (
            <div
              key={i}
              className="text-center text-[10px] leading-[12px] tabular-nums text-ink-tertiary"
            >
              {d.day}
            </div>
          ))}
        </div>

        {/* Legend order per Figma 0:93 — Wellbeing (circle) first, then
            Productivity (diamond). */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <LegendItem kind="wb" label="Wellbeing" />
          <LegendItem kind="op" label="Productivity" />
        </div>
      </button>

      {/* Explainer drawer — Figma 3:104. Mounted as a sibling so it
          isn't visually nested inside the card. */}
      <LoopsInfoSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

function LoopCell({ day }: { day: LoopDay }) {
  const isToday = !!day.today;
  const base = "flex w-6 min-h-[44px] flex-col-reverse items-center justify-start gap-1 rounded-sm py-[6px]";
  const surface = isToday
    ? "border border-accent-primary bg-accent-primary-soft"
    : "bg-[rgba(28,26,22,0.04)]";
  return (
    <div className={`${base} ${surface}`}>
      {day.dots.slice(0, 4).map((kind, j) => (
        <Dot key={j} kind={kind} />
      ))}
    </div>
  );
}

function Dot({ kind }: { kind: LoopDay["dots"][number] }) {
  // Mapping per Figma 0:39: productivity (op) = diamond, wellbeing (wb)
  // = circle. Colours follow the design system gauge — raaha-clear (cool
  // teal) for the wellbeing circle, raaha-mid-warm (warm wheat) for the
  // productivity diamond outline.
  if (kind === "wb") {
    return <span className="size-[7px] flex-shrink-0 rounded-full bg-raaha-clear" />;
  }
  return (
    <span className="size-[6px] flex-shrink-0 rotate-45 border border-raaha-mid-warm" />
  );
}

function LegendItem({ kind, label }: { kind: "op" | "wb"; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] leading-4 text-ink-secondary">
      {kind === "wb" ? (
        <span className="size-2 flex-shrink-0 rounded-full bg-raaha-clear" />
      ) : (
        <span className="size-[6px] flex-shrink-0 rotate-45 border border-raaha-mid-warm" />
      )}
      <span>{label}</span>
    </div>
  );
}
