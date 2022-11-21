/** restart animations on element */
export const restartAnimations = (element: Element): void => {
  /** get all animations on or under element */
  const animations = document
    .getAnimations()
    .filter((animation) =>
      element.contains((animation.effect as KeyframeEffect).target)
    );

  /** play in reverse */
  const reverseSpeed = 4;
  animations.forEach((animation) => {
    animation.playbackRate = -reverseSpeed;
    animation.cancel();
    animation.play();
  });

  /** restart forward */
  const delay = Math.max(...animations.map(getAnimationLength)) / reverseSpeed;
  type ElementWithTimer = Element & { animationTimer: number };
  window.clearTimeout((element as ElementWithTimer).animationTimer);
  (element as ElementWithTimer).animationTimer = window.setTimeout(() => {
    animations.forEach((animation) => {
      animation.playbackRate = 1;
      animation.cancel();
      animation.play();
    });
  }, delay);
};

/** get length of animation in ms */
const getAnimationLength = (animation: Animation) => {
  const element = (animation.effect as KeyframeEffect).target;
  if (!element) return 0;
  return getDurationMs(window.getComputedStyle(element).animationDuration);
};

/** get css duration in ms */
const getDurationMs = (duration: string) =>
  (parseFloat(duration) || 0) * (duration.indexOf("ms") !== -1 ? 1 : 1000);
