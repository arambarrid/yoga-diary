/**
 * Pure timer utilities used by the meditation timer.
 * Kept side-effect free so the logic can be unit-tested
 * without React or a browser environment.
 */

export function minutesToMs(minutes: number): number {
  return Math.round(minutes * 60 * 1000);
}

export function computeRemainingMs(now: number, startedAt: number, durationMs: number): number {
  const elapsed = now - startedAt;
  return Math.max(0, durationMs - elapsed);
}

export function formatRemaining(ms: number): string {
  // Round up so the displayed clock never reaches 00:00 before the bell rings.
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
