"use client";

// Instagram-style segmented bar. Lives at the top of the screen, OUTSIDE the
// card stack — it is not overlaid on the card. Updates on commit, not drag.

interface ProgressBarProps {
  total: number;
  currentIndex: number; // 0-based; equals number of completed segments
}

export function ProgressBar({ total, currentIndex }: ProgressBarProps) {
  return (
    <div
      className="flex w-full gap-2"
      role="progressbar"
      aria-valuenow={Math.min(currentIndex, total)}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label="Check-in progress"
    >
      {Array.from({ length: total }).map((_, i) => {
        // States per spec: completed = filled accent.primary; everything
        // else (current + upcoming) sits on a faint accent.primary at
        // 10% opacity. The earlier "current outlined, upcoming hairline"
        // distinction was dropped in the Figma update — the bar now
        // reads as a single primary fill against a single soft track.
        const className =
          i < currentIndex
            ? "h-[3px] flex-1 rounded-sm bg-accent-primary"
            : "h-[3px] flex-1 rounded-sm bg-accent-primary/10";
        return <div key={i} className={className} />;
      })}
    </div>
  );
}
