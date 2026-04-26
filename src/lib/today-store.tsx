"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { QuietBreakLocation, RestorationProposal } from "./proposal";
import type { UpNextItem } from "./today-data";

/**
 * One completed check-in. Captured at the moment the user reaches the
 * Accepted view in the swipe flow. The pick is null for any outcome
 * that doesn't have a picker (everything except quiet_break).
 */
interface RecordedOutcome {
  proposal: RestorationProposal;
  pick: QuietBreakLocation | null;
}

interface TodayStoreValue {
  /** Append-only list of completed check-in outcomes for this session. */
  outcomes: RecordedOutcome[];
  recordOutcome: (
    proposal: RestorationProposal,
    pick: QuietBreakLocation | null,
  ) => void;
  /** Manual reset hatch. Not currently wired to any UI. */
  reset: () => void;
}

const TodayStoreContext = createContext<TodayStoreValue | null>(null);

/**
 * Provider for the today-screen scratch state. Mounted in the root
 * layout so the store survives client-side route changes (Today →
 * Swipe → Today) but resets on a full page refresh, exactly per the
 * spec — "Go back to default on browser refresh".
 *
 * No persistence layer (no localStorage / sessionStorage) — refresh
 * means a fresh provider mount means a fresh empty `outcomes` array.
 */
export function TodayStoreProvider({ children }: { children: ReactNode }) {
  const [outcomes, setOutcomes] = useState<RecordedOutcome[]>([]);

  const recordOutcome = useCallback(
    (proposal: RestorationProposal, pick: QuietBreakLocation | null) => {
      setOutcomes((prev) => [...prev, { proposal, pick }]);
    },
    [],
  );

  const reset = useCallback(() => setOutcomes([]), []);

  const value = useMemo(
    () => ({ outcomes, recordOutcome, reset }),
    [outcomes, recordOutcome, reset],
  );

  return (
    <TodayStoreContext.Provider value={value}>
      {children}
    </TodayStoreContext.Provider>
  );
}

export function useTodayStore(): TodayStoreValue {
  const ctx = useContext(TodayStoreContext);
  if (!ctx) {
    throw new Error("useTodayStore must be used within TodayStoreProvider");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Merge — applies recorded outcomes onto the base Up Next list.
// ---------------------------------------------------------------------------

/**
 * Project the base UP_NEXT list through the recorded check-in outcomes,
 * in the order they were recorded. Returns a fresh, time-sorted array.
 *
 * Mutation rules per outcome:
 *   - coffee_shop_change / lounge_change → mutate the target meeting's
 *     meta string to "<new location> · 30 min" (the meeting still exists,
 *     just at a different place).
 *   - coffee_shop_snack → add a new entry at the block's start time. If
 *     a block already lives at that slot, latest replaces (you can't host
 *     a snack and a break in the same 10 minutes).
 *   - quiet_break → same as snack, with the user-picked location.
 *   - stand_down → no-op. Raaha stays quiet by definition.
 *   - null (routing fail) → never reaches Accepted, so never recorded.
 *
 * Pure function; safe to memoize on `outcomes`.
 */
export function applyOutcomesToUpNext(
  base: UpNextItem[],
  outcomes: RecordedOutcome[],
): UpNextItem[] {
  let items: UpNextItem[] = base.map((item) => ({ ...item }));

  for (const { proposal, pick } of outcomes) {
    switch (proposal.outcome) {
      case "coffee_shop_change":
      case "lounge_change": {
        const target = proposal.action.params.meetingTime;
        items = items.map((item) =>
          item.time === target
            ? {
                ...item,
                meta: `${proposal.action.params.newLocation} · 30 min`,
              }
            : item,
        );
        break;
      }

      case "coffee_shop_snack": {
        const p = proposal.action.params;
        const newItem: UpNextItem = {
          time: p.start,
          title: p.title,
          meta: `${p.location} · 10 min`,
        };
        upsertByTime(items, newItem);
        break;
      }

      case "quiet_break": {
        const p = proposal.action.params;
        const location = pick ?? p.locationOptions[0];
        const newItem: UpNextItem = {
          time: p.start,
          title: "Ten minutes for yourself",
          meta: `${location} · 10 min`,
        };
        upsertByTime(items, newItem);
        break;
      }

      case "stand_down":
        // Raaha stays quiet — the timeline is unchanged.
        break;
    }
  }

  // Stable sort by HH:MM string (lexicographic = chronological for
  // zero-padded 24-hour times, which all of our slots use).
  return items.sort((a, b) => a.time.localeCompare(b.time));
}

/** In-place upsert — replace any existing entry at the same time, else push. */
function upsertByTime(items: UpNextItem[], next: UpNextItem): void {
  const idx = items.findIndex((i) => i.time === next.time);
  if (idx >= 0) items[idx] = next;
  else items.push(next);
}

// ---------------------------------------------------------------------------
// Mood derivation — has any check-in actually created space for Hamad?
// ---------------------------------------------------------------------------

const SPACE_CREATING_OUTCOMES: ReadonlySet<RestorationProposal["outcome"]> =
  new Set([
    "coffee_shop_change",
    "lounge_change",
    "coffee_shop_snack",
    "quiet_break",
  ]);

/**
 * True if the **most recent** recorded outcome actually created space.
 * Drives the home screen's "settled" mood: the refreshed greeting,
 * gauge needle tilted toward the green, and the post-action voice copy.
 *
 * Latest-only is intentional. A stand-down after an earlier coffee-shop-
 * change reverts the home to "busy" — Raaha is now staying quiet, so the
 * celebration register no longer matches the user's most recent intent,
 * even though the earlier moved meeting still persists in Up Next.
 *
 * The Up Next merge keeps full-history semantics; only the *mood* tracks
 * the latest outcome. Banner visibility is its own concern — see
 * `hasCheckedInThisSession`.
 */
export function hasSpaceBeenCreated(
  outcomes: ReadonlyArray<{ proposal: RestorationProposal }>,
): boolean {
  const latest = outcomes[outcomes.length - 1];
  if (!latest) return false;
  return SPACE_CREATING_OUTCOMES.has(latest.proposal.outcome);
}

/**
 * True once the user has completed at least one check-in this session,
 * regardless of which outcome it produced. Drives banner visibility on
 * the home screen — once Hamad has acknowledged Raaha (even by
 * accepting a stand-down), the "next meeting / Check in" alert no
 * longer makes sense; he's already decided.
 */
export function hasCheckedInThisSession(
  outcomes: ReadonlyArray<unknown>,
): boolean {
  return outcomes.length > 0;
}
