import type { CSSProperties } from "react";

interface SkeletonProps {
  /** Width — number for px, string for percentage / arbitrary CSS. */
  w?: number | string;
  /** Height — defaults to 12px (caption-ish text). */
  h?: number | string;
  /** Border radius in px — defaults to 4. */
  r?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Loading-state primitive. A horizontal hairline gradient that animates
 * across (`animate-shimmer` from tailwind.config.ts), sized inline because
 * each call site stands in for a specific real element.
 *
 * The gradient uses --line-hairline at the ends and a 50%-alpha tint at
 * the midpoint — a static gradient with `bg-line-hairline` would lose the
 * mid-stop sweep, so we apply it via inline style.
 *
 * `motion-reduce:animate-none` — honours the OS preference, just like
 * SwipeCard's reduced-motion path.
 */
export function Skeleton({ w, h = 12, r = 4, className, style }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`inline-block flex-shrink-0 animate-shimmer motion-reduce:animate-none${
        className ? ` ${className}` : ""
      }`}
      style={{
        width: w,
        height: h,
        borderRadius: r,
        backgroundImage:
          "linear-gradient(90deg, #E5DED3 0%, rgba(229,222,211,0.5) 50%, #E5DED3 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    />
  );
}
