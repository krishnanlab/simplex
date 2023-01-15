import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useEvent } from "react-use";

/** apply fade gradient to sides of scrollable area */
export const useScrollMask = <T extends HTMLElement>(size = "60px") => {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  /** recompute styles on scroll */
  const onScroll = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    /** which sides to apply gradient to */
    const top = element.scrollTop > 0 ? "transparent" : "white";
    const bottom =
      element.scrollTop + element.clientHeight < element.scrollHeight
        ? "transparent"
        : "white";
    const left = element.scrollLeft > 0 ? "transparent" : "white";
    const right =
      element.scrollLeft + element.clientWidth < element.scrollWidth
        ? "transparent"
        : "white";

    /** css gradients */
    const gradients = `
      linear-gradient(to bottom, ${top}, white ${size} calc(100% - ${size}), ${bottom}),
      linear-gradient(to right, ${left}, white ${size} calc(100% - ${size}), ${right})
    `;

    setStyle({
      WebkitMaskImage: gradients,
      WebkitMaskComposite: "source-in",
      maskImage: gradients,
      maskComposite: "intersect",
    });
  }, [size]);

  useEvent("scroll", onScroll, ref.current);
  useEffect(() => {
    onScroll();
  }, [onScroll]);

  return { ref, style };
};
