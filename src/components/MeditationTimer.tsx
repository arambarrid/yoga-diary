"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  computeRemainingMs,
  formatRemaining,
  minutesToMs,
} from "@/lib/timer";

const PRESET_MINUTES = [5, 10, 15, 20, 30] as const;
const DEFAULT_MINUTES = 10;
const TICK_INTERVAL_MS = 100;
const FINISH_REDIRECT_DELAY_MS = 2_500;
const MAX_DURATION_MINUTES = 180;

type Phase = "idle" | "running" | "finished";

export function MeditationTimer() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [durationMin, setDurationMin] = useState<number>(DEFAULT_MINUTES);
  const [customValue, setCustomValue] = useState<string>("");
  const [remainingMs, setRemainingMs] = useState<number>(
    minutesToMs(DEFAULT_MINUTES),
  );

  // Refs hold values that the render output doesn't depend on directly,
  // so updating them doesn't trigger re-renders.
  const startedAtRef = useRef<number | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFinish() {
    playBell();
    setPhase("finished");
    finishTimeoutRef.current = setTimeout(() => {
      router.push(
        `/practices/new?type=meditation&durationMin=${durationMin}`,
      );
    }, FINISH_REDIRECT_DELAY_MS);
  }

  function handleStart() {
    playBell();
    startedAtRef.current = Date.now();
    setRemainingMs(minutesToMs(durationMin));
    setPhase("running");
  }

  function handleCancel() {
    startedAtRef.current = null;
    setRemainingMs(minutesToMs(durationMin));
    setPhase("idle");
  }

  function handleCustomChange(value: string) {
    setCustomValue(value);
    const n = Number(value);
    if (Number.isFinite(n) && n > 0 && n <= MAX_DURATION_MINUTES) {
      setDurationMin(n);
    }
  }

  function pickPreset(minutes: number) {
    setCustomValue("");
    setDurationMin(minutes);
    setRemainingMs(minutesToMs(minutes));
  }

  // Drive the countdown while the session is running.
  useEffect(() => {
    if (phase !== "running") return;
    const totalMs = minutesToMs(durationMin);
    const intervalId = setInterval(() => {
      if (startedAtRef.current === null) return;
      const remaining = computeRemainingMs(
        Date.now(),
        startedAtRef.current,
        totalMs,
      );
      setRemainingMs(remaining);
      if (remaining <= 0) {
        clearInterval(intervalId);
        handleFinish();
      }
    }, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
    // handleFinish closes over router and durationMin, which are intentionally
    // excluded from the dep list to avoid restarting the interval mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, durationMin]);

  // Clear any pending redirect on unmount.
  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, []);

  if (phase === "running") {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <p className="text-sm uppercase tracking-wider text-stone-500">
          En sesión
        </p>
        <div className="text-7xl font-light tabular-nums text-stone-900">
          {formatRemaining(remainingMs)}
        </div>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancelar sesión
        </Button>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-2xl font-medium text-stone-900">Sesión completa</p>
        <p className="text-sm text-stone-500">
          Te llevamos al registro en un instante...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-medium text-stone-800">
          ¿Cuánto vas a meditar?
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Elegí un preset o ingresá una duración custom (1 a 180 minutos).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_MINUTES.map((minutes) => {
          const isActive = customValue === "" && durationMin === minutes;
          return (
            <button
              key={minutes}
              type="button"
              onClick={() => pickPreset(minutes)}
              className={`text-sm px-4 py-2 rounded-full border transition ${
                isActive
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
              }`}
            >
              {minutes} min
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="custom-duration"
          className="text-sm font-medium text-stone-800"
        >
          Custom
        </label>
        <Input
          id="custom-duration"
          type="number"
          min={1}
          max={MAX_DURATION_MINUTES}
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="minutos"
          className="w-32"
        />
      </div>

      <div className="pt-2">
        <Button
          type="button"
          onClick={handleStart}
          disabled={durationMin <= 0}
        >
          Empezar — {durationMin} min
        </Button>
      </div>
    </div>
  );
}

/**
 * Synthesize a soft bell tone reminiscent of a singing bowl.
 *
 * Two sine oscillators are stacked: a fundamental at 220 Hz (A3) plus
 * its octave at 440 Hz (A4) at a lower amplitude for harmonic richness.
 * Both layers share an exponential decay envelope; the octave fades two
 * seconds earlier so the fundamental carries the tail.
 */
function playBell() {
  if (typeof window === "undefined" || !window.AudioContext) return;
  try {
    const ctx = new window.AudioContext();
    const now = ctx.currentTime;
    const decaySeconds = 7;
    const fundamental = createLayer(ctx, 220, "sine", 0.22, now, decaySeconds);
    createLayer(ctx, 440, "sine", 0.08, now, decaySeconds - 2);

    // Close the audio context after the last oscillator finishes,
    // so we don't leak resources across many sessions.
    fundamental.onended = () => void ctx.close();
  } catch {
    // Audio is best-effort; some browsers block it outside user gestures.
  }
}

function createLayer(
  ctx: AudioContext,
  frequencyHz: number,
  waveType: OscillatorType,
  peakGain: number,
  startTime: number,
  decaySeconds: number,
): OscillatorNode {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = waveType;
  oscillator.frequency.value = frequencyHz;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(peakGain, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + decaySeconds);
  oscillator.start(startTime);
  oscillator.stop(startTime + decaySeconds);
  return oscillator;
}
