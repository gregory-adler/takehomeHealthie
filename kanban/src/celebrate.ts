import confetti from "canvas-confetti";

// Two bursts of confetti from the bottom corners
export function celebrate() {
  const shared = { particleCount: 80, spread: 70, startVelocity: 55 };

  confetti({ ...shared, angle: 60, origin: { x: 0, y: 1 } });
  confetti({ ...shared, angle: 120, origin: { x: 1, y: 1 } });
}
