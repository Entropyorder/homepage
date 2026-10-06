import { duration, ease, offset } from './tokens.js';

function makeTransition(dur, delay) {
  const t = { duration: dur, ease: ease.default };
  if (delay != null) t.delay = delay;
  return t;
}

export function fadeUp(yOffset = offset.medium, dur = duration.normal, delay) {
  return {
    initial: { opacity: 0, y: yOffset },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: makeTransition(dur, delay),
  };
}

export function fadeLeft(xOffset = offset.small, dur = duration.normal, delay) {
  return {
    initial: { opacity: 0, x: -xOffset },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: makeTransition(dur, delay),
  };
}

export function fadeRight(xOffset = offset.small, dur = duration.normal, delay) {
  return {
    initial: { opacity: 0, x: xOffset },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: makeTransition(dur, delay),
  };
}

export function scaleIn(dur = duration.normal, delay) {
  return {
    initial: { opacity: 0, scale: 0.85 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: makeTransition(dur, delay),
  };
}

export function fadeIn(dur = duration.normal, delay) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: makeTransition(dur, delay),
  };
}
