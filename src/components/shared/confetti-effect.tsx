"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

/**
 * https://www.kirilv.com/canvas-confetti/
 */
export function triggerConfetti(options?: {
  duration?: number;
}) {
  const duration = options?.duration || 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 100 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 200);
}

export default function ConfettiEffect() {
  useEffect(() => {
    return triggerConfetti();
  }, []);

  return null;
}
