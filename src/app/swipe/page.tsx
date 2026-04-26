import { Suspense } from "react";

import { SwipeStack } from "@/components/swipe/SwipeStack";

export default function SwipePage() {
  // Suspense boundary required because SwipeStack reads useSearchParams()
  // for the dev-only ?scenario= flag. Without it, Next bails on static
  // optimisation for the whole route. Fallback is empty — the stack mounts
  // immediately on hydration, no perceptible flash.
  return (
    <Suspense fallback={null}>
      <SwipeStack />
    </Suspense>
  );
}
