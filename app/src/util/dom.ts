// restart animations on a given dom element
export const restartAnimations = (element: Element): void => {
  for (const animation of document.getAnimations()) {
    if (element.contains((animation.effect as KeyframeEffect).target)) {
      animation.cancel();
      animation.play();
    }
  }
};
