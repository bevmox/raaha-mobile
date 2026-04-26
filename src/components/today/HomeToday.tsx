"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  BANNER_DELAY_AFTER_LOAD_MS,
  BANNER_ENTER_DELAY_S,
  BANNER_ENTER_DURATION_S,
  ENTER_EASE,
  SKELETON_HOLD_MS,
} from "@/lib/today-timing";
import { LOOPS_11, UP_NEXT, type LoopDay } from "@/lib/today-data";
import {
  applyOutcomesToUpNext,
  hasCheckedInThisSession,
  hasSpaceBeenCreated,
  useTodayStore,
} from "@/lib/today-store";
import { useReducedMotion } from "@/lib/useReducedMotion";

import { LoopsCard } from "./LoopsCard";
import { ReadingHero } from "./ReadingHero";
import { Skeleton } from "./Skeleton";
import { SwipeTransition } from "./SwipeTransition";
import { UpcomingMeetingCard } from "./UpcomingMeetingCard";
import { UpNextWidget } from "./UpNextWidget";

type Phase = "loading" | "loaded" | "banner";

/**
 * Pool of interstitial label *pairs* rotated through on each "Check in with
 * Raaha" tap. Each variant runs as a two-beat sequence inside one transition:
 * the first label is preparatory (the action of settling), the second is
 * reassuring (why it's okay to settle). Sequential rotation (not random) —
 * guarantees the variant changes on every press without repeating back-to-
 * back. Voice-of-Raaha register: quiet, present-tense, no exclamation, no
 * instruction.
 */
const TRANSITION_VARIANTS: ReadonlyArray<readonly [string, string]> = [
  ["Getting comfortable", "This is a safe place"],
  ["Pouring the tea", "Take your time"],
  ["Pulling the curtains", "Just a moment for you"],
  ["Catching your breath", "No need to rush"],
  ["Settling in", "Whatever comes up is fine"],
  ["Quiet for a moment", "Just between us"],
  ["Making space", "We're listening"],
];

/**
 * Resolves a starting phase + a "pinned" flag from the URL hash. Hash is
 * used (not query) so this works behind any static server that might
 * strip query strings, and so it doesn't bake into Next's URL routing.
 *
 *   #loading=hold    → freeze on phase 1 (skeletons)
 *   #loading=loaded  → freeze on phase 2 (loaded, no banner)
 *   #loading=0       → start on phase 3 (banner already in)
 *   no flag          → auto-advance through all three phases
 *
 * TODO(real-data): once data is fetched from an API, derive `phase`
 * from loading state directly and treat these flags as dev-only.
 */
function resolveInitialPhase(): { phase: Phase; pinned: boolean } {
  if (typeof window === "undefined") return { phase: "loading", pinned: false };
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const flag = params.get("loading");
  if (flag === "0") return { phase: "banner", pinned: true };
  if (flag === "loaded") return { phase: "loaded", pinned: true };
  if (flag === "hold") return { phase: "loading", pinned: true };
  return { phase: "loading", pinned: false };
}

export function HomeToday() {
  const reducedMotion = useReducedMotion();

  // Resolve once on mount, then re-resolve on hashchange so the dev
  // flag (#loading=hold|loaded|0) can be flipped without a full reload.
  // Server render starts in "loading"; client hydrates and may
  // immediately bump to "loaded"/"banner" if pinned.
  const [phase, setPhase] = useState<Phase>("loading");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const apply = () => {
      const resolved = resolveInitialPhase();
      setPhase(resolved.phase);
      setPinned(resolved.pinned);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    // Schedule both transitions up-front. Depending on `phase` here would
    // cause the cleanup to fire (and clear t2) the moment t1 promotes
    // phase to "loaded" — losing the banner. Only `pinned` is a dep.
    if (pinned) return;
    const t1 = setTimeout(() => setPhase("loaded"), SKELETON_HOLD_MS);
    const t2 = setTimeout(
      () => setPhase("banner"),
      SKELETON_HOLD_MS + BANNER_DELAY_AFTER_LOAD_MS,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pinned]);

  const isLoading = phase === "loading";
  const showBanner = phase === "banner";

  // Project the base UP_NEXT through the recorded check-in outcomes.
  // Resets to base on a full browser refresh (the provider re-mounts
  // with an empty outcomes array). Subsequent check-ins append to the
  // store and re-render here with the new merged timeline.
  const { outcomes } = useTodayStore();
  const upNextItems = useMemo(() => {
    const merged = applyOutcomesToUpNext(UP_NEXT, outcomes);
    // Once any check-in has completed this session, drop the inline CTA
    // from every Up Next row per Figma 8:104 — the user has already
    // acknowledged the meeting via Raaha. Re-checking-in is still
    // available via the ReadingHero CTA at the top of the page.
    if (outcomes.length === 0) return merged;
    return merged.map(({ cta, ...rest }) => rest);
  }, [outcomes]);
  // Two distinct flags driven by the same outcomes log:
  //   - spaceCreated: tracks the *latest* outcome only. Settled mood
  //     comes from Hamad's most recent decision, not the cumulative
  //     history. A stand-down after a coffee-shop-change reverts the
  //     mood to busy because Raaha is now staying quiet.
  //   - checkedIn: any outcome at all. Hides the meeting banner
  //     because Hamad has already acknowledged the next meeting via
  //     Raaha — including by accepting a stand-down.
  const spaceCreated = useMemo(
    () => hasSpaceBeenCreated(outcomes),
    [outcomes],
  );
  const checkedIn = useMemo(
    () => hasCheckedInThisSession(outcomes),
    [outcomes],
  );

  // Loops grid mirrors Up Next's persistence model — base data, then the
  // settled mood appends a Wellbeing dot on today's cell to mark the just-
  // closed loop. Per Figma 8:77: post-completion the today cell gains
  // one extra circle on top of its existing dots. Stand-down doesn't
  // count (mood reverts to busy → loopsDays returns to base).
  const loopsDays = useMemo<LoopDay[]>(() => {
    if (!spaceCreated) return LOOPS_11;
    return LOOPS_11.map((day) =>
      day.today
        ? { ...day, dots: [...day.dots, "wb" as const] }
        : day,
    );
  }, [spaceCreated]);

  // Interstitial state for the home → swipe transition. Null when idle;
  // a label-pair while the overlay is mounted. Cleared on unmount.
  const router = useRouter();
  const [transitionLabels, setTransitionLabels] = useState<
    readonly string[] | null
  >(null);
  const variantIndexRef = useRef(0);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Capture-only: #transition=open pins the interstitial open with the
  // first variant's label pair, no auto-navigation. Lets the Figma capture
  // tool grab a screenshot of the loading state without timing tricks.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      if (params.get("transition") === "open") {
        setTransitionLabels(TRANSITION_VARIANTS[0]);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  // Prefetch /swipe so the navigation at the end of the interstitial is
  // instant — Link prefetches in the viewport too, but explicit is cheap
  // insurance for the buttons that may sit below the fold on small screens.
  useEffect(() => {
    router.prefetch("/swipe");
  }, [router]);

  // Clear any in-flight nav timer on unmount so a fast back-nav doesn't
  // leave a setTimeout firing into a dead component.
  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const startSwipeTransition = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Opt out of Link's automatic navigation — we drive the route
      // change ourselves at the end of the interstitial.
      e.preventDefault();
      if (transitionLabels) return; // Ignore double-taps mid-transition.

      const variant =
        TRANSITION_VARIANTS[
        variantIndexRef.current % TRANSITION_VARIANTS.length
        ];
      variantIndexRef.current =
        (variantIndexRef.current + 1) % TRANSITION_VARIANTS.length;
      setTransitionLabels(variant);

      // Match the same SKELETON_HOLD the home screen uses on first load —
      // the perceived "pause to settle" rhythm stays consistent across
      // screens. The progress bar is sized to fill over this exact window;
      // the label pair crossfades at the midpoint of the same window.
      navTimerRef.current = setTimeout(() => {
        router.push("/swipe");
      }, SKELETON_HOLD_MS);
    },
    [router, transitionLabels],
  );

  return (
    <main className="mx-auto min-h-dvh w-full max-w-mobile bg-canvas px-5 pb-8 pt-5">
      {/* Header — date + greeting OR a height-locked skeleton. The height
          (54px) matches date(16) + 6 gap + greeting(32) line-heights so
          the cards below don't shift when real text arrives. */}
      {isLoading ? (
        <div
          aria-busy
          aria-label="Loading"
          className="flex h-[54px] flex-col gap-[10px] pt-0.5"
        >
          <Skeleton w={88} h={12} className="block" />
          <Skeleton w={244} h={24} r={6} className="block" />
        </div>
      ) : (
        <>
          <div className="text-[12px] leading-4 tabular-nums text-ink-secondary">
            Tuesday · 14:07
          </div>
          <p className="mt-[6px] text-[24px] leading-8 tracking-tight text-ink-primary [text-wrap:pretty]">
            {spaceCreated ? "How are you, Hamad?" : "Take some time, Hamad"}
          </p>
        </>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {/* Banner slot — Framer's AnimatePresence handles mount/unmount.
            The height: 0 → "auto" trick (combined with margin/scale/y on
            the inner card) makes the rest of the stack push down smoothly
            instead of popping into place. Reduced-motion path swaps to a
            simple opacity fade. */}
        <AnimatePresence initial={false}>
          {showBanner && !checkedIn && (
            <motion.div
              key="meeting-banner"
              initial={
                reducedMotion
                  ? { opacity: 0, height: "auto" }
                  : { opacity: 0, y: -10, scale: 0.985, height: 0 }
              }
              animate={
                reducedMotion
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 1, y: 0, scale: 1, height: "auto" }
              }
              exit={
                reducedMotion
                  ? { opacity: 0, height: 0 }
                  : { opacity: 0, y: -10, scale: 0.985, height: 0 }
              }
              transition={{
                duration: reducedMotion ? 0 : BANNER_ENTER_DURATION_S,
                ease: ENTER_EASE,
                delay: reducedMotion ? 0 : BANNER_ENTER_DELAY_S,
              }}
              style={{ overflow: "hidden" }}
            >
              <UpcomingMeetingCard
                minutesUntil={23}
                title="1:1 / Ahmad"
                location="Microsoft Teams"
                onCheckIn={startSwipeTransition}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ReadingHero
          headline={
            spaceCreated ? "Feeling like a huge win" : "Steady, but getting busier"
          }
          voice={
            spaceCreated ? "You’re in a good place." : "Take a moment for yourself"
          }
          ctaLabel="Check in"
          mood={spaceCreated ? "settled" : "busy"}
          onCheckIn={startSwipeTransition}
          loading={isLoading}
        />

        {/* Loops + Up Next are separate cards per Figma 0:8 — each owns
            its own surface chrome. The earlier merged-card iteration
            was reverted in the latest design. */}
        <LoopsCard days={loopsDays} loading={isLoading} />
        <UpNextWidget
          items={upNextItems}
          now="14:07"
          onCheckIn={(_at, e) => startSwipeTransition(e)}
          loading={isLoading}
        />
      </div>

      {/* Interstitial overlay between Today and Swipe. Sits above the
          stack via z-50; AnimatePresence handles fade in/out. The label
          pair rotates per click (see TRANSITION_VARIANTS above) and
          crossfades inside the hold. */}
      <AnimatePresence>
        {transitionLabels && <SwipeTransition labels={transitionLabels} />}
      </AnimatePresence>
    </main>
  );
}
