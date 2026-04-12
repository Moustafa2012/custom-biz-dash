import { useEffect, useRef, useState, ReactNode } from "react";

// ─── CSS injection (idempotent) ───────────────────────────────────────────────
const STYLE_ID = "animated-section-styles";

function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* ── Base hidden states ── */
    .sa-hidden { pointer-events: none; }
    .sa-visible { pointer-events: auto; }

    /* ── Shared transition (overridden per animation via custom props) ── */
    [class*="sa-anim-"] {
      transition:
        opacity    var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)),
        transform  var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)),
        filter     var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)),
        clip-path  var(--sa-duration, 0.7s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1));
    }

    /* ── fade-up ── */
    .sa-anim-fade-up.sa-hidden  { opacity: 0; transform: translateY(var(--sa-distance, 40px)); }
    .sa-anim-fade-up.sa-visible { opacity: 1; transform: translateY(0); }

    /* ── fade-down ── */
    .sa-anim-fade-down.sa-hidden  { opacity: 0; transform: translateY(calc(var(--sa-distance, 40px) * -1)); }
    .sa-anim-fade-down.sa-visible { opacity: 1; transform: translateY(0); }

    /* ── fade-left ── */
    .sa-anim-fade-left.sa-hidden  { opacity: 0; transform: translateX(var(--sa-distance, 50px)); }
    .sa-anim-fade-left.sa-visible { opacity: 1; transform: translateX(0); }

    /* ── fade-right ── */
    .sa-anim-fade-right.sa-hidden  { opacity: 0; transform: translateX(calc(var(--sa-distance, 50px) * -1)); }
    .sa-anim-fade-right.sa-visible { opacity: 1; transform: translateX(0); }

    /* ── scale-reveal ── */
    .sa-anim-scale-reveal.sa-hidden  { opacity: 0; transform: scale(var(--sa-scale-from, 0.88)); }
    .sa-anim-scale-reveal.sa-visible { opacity: 1; transform: scale(1); }

    /* ── scale-up ── */
    .sa-anim-scale-up.sa-hidden  { opacity: 0; transform: scale(var(--sa-scale-from, 1.1)); }
    .sa-anim-scale-up.sa-visible { opacity: 1; transform: scale(1); }

    /* ── curtain (clip-path wipe from bottom) ── */
    .sa-anim-curtain.sa-hidden  { clip-path: inset(100% 0% 0% 0%); opacity: 1; }
    .sa-anim-curtain.sa-visible { clip-path: inset(0% 0% 0% 0%); opacity: 1; }

    /* ── curtain-left (clip-path wipe from right) ── */
    .sa-anim-curtain-left.sa-hidden  { clip-path: inset(0% 0% 0% 100%); opacity: 1; }
    .sa-anim-curtain-left.sa-visible { clip-path: inset(0% 0% 0% 0%); opacity: 1; }

    /* ── flip-up (3-D perspective tilt) ── */
    .sa-anim-flip-up.sa-hidden  { opacity: 0; transform: perspective(600px) rotateX(30deg) translateY(var(--sa-distance, 30px)); }
    .sa-anim-flip-up.sa-visible { opacity: 1; transform: perspective(600px) rotateX(0deg)  translateY(0); }

    /* ── blur-in ── */
    .sa-anim-blur-in.sa-hidden  { opacity: 0; filter: blur(var(--sa-blur, 12px)); }
    .sa-anim-blur-in.sa-visible { opacity: 1; filter: blur(0px); }

    /* ── zoom-rotate ── */
    .sa-anim-zoom-rotate.sa-hidden  { opacity: 0; transform: scale(0.8) rotate(var(--sa-rotate, -8deg)); }
    .sa-anim-zoom-rotate.sa-visible { opacity: 1; transform: scale(1)   rotate(0deg); }

    /* ── stagger: styles children via CSS sibling logic ── */
    .sa-anim-stagger > * {
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity   var(--sa-duration, 0.55s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1)),
        transform var(--sa-duration, 0.55s) var(--sa-ease, cubic-bezier(0.22, 1, 0.36, 1));
    }
    .sa-anim-stagger.sa-visible > *:nth-child(1)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 1); }
    .sa-anim-stagger.sa-visible > *:nth-child(2)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 2); }
    .sa-anim-stagger.sa-visible > *:nth-child(3)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 3); }
    .sa-anim-stagger.sa-visible > *:nth-child(4)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 4); }
    .sa-anim-stagger.sa-visible > *:nth-child(5)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 5); }
    .sa-anim-stagger.sa-visible > *:nth-child(6)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 6); }
    .sa-anim-stagger.sa-visible > *:nth-child(7)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 7); }
    .sa-anim-stagger.sa-visible > *:nth-child(8)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 8); }
    .sa-anim-stagger.sa-visible > *:nth-child(9)  { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 9); }
    .sa-anim-stagger.sa-visible > *:nth-child(10) { opacity: 1; transform: translateY(0); transition-delay: calc(var(--sa-stagger-delay, 0.1s) * 10); }

    /* ── Respect reduced motion ── */
    @media (prefers-reduced-motion: reduce) {
      [class*="sa-anim-"] { transition: opacity 0.2s ease !important; }
      [class*="sa-anim-"].sa-hidden  { opacity: 0; transform: none !important; filter: none !important; clip-path: none !important; }
      [class*="sa-anim-"].sa-visible { opacity: 1; transform: none !important; filter: none !important; clip-path: none !important; }
      .sa-anim-stagger > * { transform: none !important; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-reveal"
  | "scale-up"
  | "curtain"
  | "curtain-left"
  | "flip-up"
  | "blur-in"
  | "zoom-rotate"
  | "stagger";

export interface AnimatedSectionProps {
  children: ReactNode;
  /** Delay before animation triggers after threshold is crossed (seconds) */
  delay?: number;
  className?: string;
  animation?: AnimationType;
  /**
   * Transition duration in seconds.
   * @default 0.7
   */
  duration?: number;
  /**
   * CSS easing function.
   * @default "cubic-bezier(0.22, 1, 0.36, 1)"
   */
  ease?: string;
  /**
   * Translate distance for directional animations (px).
   * @default 40
   */
  distance?: number;
  /**
   * Per-child delay step for "stagger" animation (seconds).
   * @default 0.1
   */
  staggerDelay?: number;
  /**
   * When true, the animation only plays once and won't reset on scroll-out.
   * @default false
   */
  once?: boolean;
  /**
   * IntersectionObserver threshold (0–1).
   * @default 0.08
   */
  threshold?: number;
  /**
   * IntersectionObserver rootMargin.
   * @default "0px 0px -60px 0px"
   */
  rootMargin?: string;
  /** Called when element enters the viewport */
  onEnter?: () => void;
  /** Called when element leaves the viewport (only if once=false) */
  onLeave?: () => void;
  /** HTML tag to render as. @default "div" */
  as?: keyof JSX.IntrinsicElements;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
  animation = "fade-up",
  duration = 0.7,
  ease = "cubic-bezier(0.22, 1, 0.36, 1)",
  distance = 40,
  staggerDelay = 0.1,
  once = false,
  threshold = 0.08,
  rootMargin = "0px 0px -60px 0px",
  onEnter,
  onLeave,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply CSS custom properties for tuneable values
    el.style.setProperty("--sa-duration", `${duration}s`);
    el.style.setProperty("--sa-ease", ease);
    el.style.setProperty("--sa-distance", `${distance}px`);
    el.style.setProperty("--sa-stagger-delay", `${staggerDelay}s`);

    el.classList.add(`sa-anim-${animation}`, "sa-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated) return;

            timerRef.current = setTimeout(() => {
              el.classList.remove("sa-hidden");
              el.classList.add("sa-visible");
              setHasAnimated(true);
              onEnter?.();
            }, delay * 1000);
          } else {
            if (once && hasAnimated) return;

            if (timerRef.current) clearTimeout(timerRef.current);
            el.classList.remove("sa-visible");
            el.classList.add("sa-hidden");
            onLeave?.();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [animation, delay, duration, ease, distance, staggerDelay, once, threshold, rootMargin, hasAnimated, onEnter, onLeave]);

  return (
    // @ts-expect-error — polymorphic "as" prop is safe here
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}