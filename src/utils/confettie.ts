// @ts-ignore
import confetti from "canvas-confetti";

var count = 200;
var defaults = {
  origin: { y: 0.7 },
};

export function fire(particleRatio: any, opts: any) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

