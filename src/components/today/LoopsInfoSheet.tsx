"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { ENTER_EASE } from "@/lib/today-timing";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface LoopsInfoSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Bottom-sheet drawer that explains what a "loop" is and how the two
 * loop types differ. Triggered by tapping the LoopsCard on the Today
 * screen. Layout per Figma 3:104.
 *
 * Behaviour:
 *   - Backdrop fades in (rgba(0,0,0,0.4)).
 *   - Drawer slides up from the bottom with the project's shared ease.
 *   - Tapping the backdrop, the X icon, or pressing Escape closes it.
 *   - Body scroll is locked while open so background content can't drift.
 *   - Reduced-motion users get a plain opacity fade with no slide.
 *
 * Visually it sits inside the same mobile column the page uses
 * (max-w-mobile, centered) so the simulated "phone popup" reads
 * correctly on desktop too.
 */
export function LoopsInfoSheet({ open, onClose }: LoopsInfoSheetProps) {
  const reducedMotion = useReducedMotion();

  // Body-scroll lock: prevents the page beneath the sheet from moving
  // while the sheet is being read. Restores prior overflow on close.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape key closes — keeps keyboard parity with the X button.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop. Tapping it closes the sheet. */}
          <motion.div
            key="loops-info-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Drawer. Centred in the mobile column on wider viewports so
              the page reads as a phone simulation rather than a desktop
              modal. radius is on top corners only — bottom is flush.
              Important: the X-translate has to live inside framer-motion's
              animation values (not in the className as `-translate-x-1/2`),
              because Framer rewrites `transform` on every frame and would
              otherwise clobber a CSS-only X translate. */}
          <motion.div
            key="loops-info-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loops-info-eyebrow"
            initial={
              reducedMotion
                ? { opacity: 0, x: "-50%" }
                : { opacity: 1, x: "-50%", y: "100%" }
            }
            animate={
              reducedMotion
                ? { opacity: 1, x: "-50%" }
                : { opacity: 1, x: "-50%", y: 0 }
            }
            exit={
              reducedMotion
                ? { opacity: 0, x: "-50%" }
                : { opacity: 1, x: "-50%", y: "100%" }
            }
            transition={{
              duration: reducedMotion ? 0 : 0.32,
              ease: ENTER_EASE,
            }}
            className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-mobile flex-col gap-6 rounded-t-md bg-surface p-6 shadow-md"
          >
            <header className="flex items-center justify-between">
              <p
                id="loops-info-eyebrow"
                className="m-0 text-[12px] font-medium leading-4 text-ink-tertiary"
              >
                LOOPS
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-m-1 rounded-sm p-1 text-ink-primary transition-opacity hover:opacity-70"
              >
                <CloseIcon />
              </button>
            </header>

            <p className="m-0 text-[32px] font-medium leading-[40px] text-raaha-clear">
              Raaha closes the day with you in mind.
            </p>

            {/* Body. Each gap-5 boundary mirrors a 20px paragraph break
                in Figma — the three short lines are tight so they read
                as a list, not three separate paragraphs. */}
            <div className="flex flex-col gap-5 text-[14px] leading-5 text-ink-primary">
              <p className="m-0 font-semibold">
                A loop is a thread in your day that needs resolving.
              </p>
              <div className="flex flex-col">
                <p className="m-0">A meeting to move.</p>
                <p className="m-0">A message to send.</p>
                <p className="m-0">A 1:1 that didn&rsquo;t land.</p>
              </div>
              <p className="m-0">
                Raaha opens loops by reading your calendar, your messages,
                the time since you last paused.
              </p>
              <p className="m-0">It proposes a specific close.</p>
              <p className="m-0 font-semibold">You decide.</p>
            </div>

            <hr className="m-0 h-px w-full border-0 bg-line-hairline" />

            <div className="flex flex-col gap-6">
              <LoopTypeBlock
                kind="wb"
                label="WELLBEING LOOPS"
                heading="Make space for rest."
                description="A 1:1 taken over coffee. Permission to leave at the right time. A pause before the next meeting."
              />
              <LoopTypeBlock
                kind="op"
                label="PRODUCTIVITY LOOPS"
                heading="Clear weight from the day."
                description="A stand-up moved. A delay note sent. A close-the-loop message after a hard 1:1."
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * One of the two loop-type explainer blocks. Same layout as the LoopsCard
 * legend but at a larger scale and with descriptive body underneath.
 */
function LoopTypeBlock({
  kind,
  label,
  heading,
  description,
}: {
  kind: "wb" | "op";
  label: string;
  heading: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        {kind === "wb" ? (
          <span className="size-4 flex-shrink-0 rounded-full bg-raaha-clear" />
        ) : (
          // 11px square rotated 45° fits exactly inside a 16px box and
          // matches the LoopsCard diamond proportions, scaled up.
          <span className="flex size-4 flex-shrink-0 items-center justify-center">
            <span className="size-[11px] rotate-45 border-2 border-raaha-mid-warm" />
          </span>
        )}
        <p className="m-0 text-[12px] font-medium leading-4 text-ink-primary">
          {label}
        </p>
      </div>
      <div className="flex flex-col text-[14px] leading-5 text-ink-tertiary">
        <p className="m-0">{heading}</p>
        <p className="m-0">{description}</p>
      </div>
    </div>
  );
}

/** 20×20 close (×) icon. currentColor so it inherits ink-primary. */
function CloseIcon() {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 5l10 10" />
      <path d="M15 5L5 15" />
    </svg>
  );
}
