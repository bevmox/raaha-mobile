"use client";

import type { ReactNode } from "react";

import { TodayStoreProvider } from "@/lib/today-store";

/**
 * Client-side provider stack mounted at the root layout level.
 *
 * Putting the providers in their own "use client" file lets `layout.tsx`
 * stay a server component (Next App Router default) while the in-memory
 * stores it wraps still get their React Context.
 *
 * State held here survives client-side route changes (Today → Swipe →
 * Today) but is wiped on a full browser refresh — exactly the lifetime
 * required for "outcomes show in Up Next, reset on refresh".
 */
export function Providers({ children }: { children: ReactNode }) {
  return <TodayStoreProvider>{children}</TodayStoreProvider>;
}
