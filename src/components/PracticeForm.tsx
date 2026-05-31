"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ChipMultiSelect } from "@/components/ui/ChipMultiSelect";
import { Textarea } from "@/components/ui/Textarea";
import { MoodSlider } from "@/components/ui/MoodSlider";
import { focusObjectLabels, guidanceLabels, positionLabels, yogaStyleLabels } from "@/lib/labels";
import type { FocusObject, Guidance, Position, PracticeInput, YogaStyle } from "@/lib/schemas";

type PracticeType = "yoga" | "meditation";

type Initial = Partial<{
  id: string;
  type: PracticeType;
  date: string;
  durationMin: number;
  guidance: Guidance;
  moodBefore: number | null;
  moodAfter: number | null;
  notes: string | null;
  yogaStyle: YogaStyle | null;
  yogaStyleCustom: string | null;
  focusObjects: FocusObject[];
  position: Position | null;
}>;

type Props = {
  initial?: Initial;
  mode?: "create" | "edit";
  // Distinct custom yoga style names previously saved, offered as options in
  // the style dropdown.
  yogaStyleCustoms?: string[];
};

function toLocalDateTimeValue(d: Date | string | undefined): string {
  const date = d ? new Date(d) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PracticeForm({ initial = {}, mode = "create", yogaStyleCustoms = [] }: Props) {
  const router = useRouter();
  const [type, setType] = useState<PracticeType>(initial.type ?? "yoga");
  // The yoga-style <select> value is a known enum, "other" (to name a new one),
  // or "custom:<name>" for a previously-saved custom style.
  const editingCustom =
    initial.yogaStyle === "other" && initial.yogaStyleCustom ? initial.yogaStyleCustom : null;
  const [yogaStyle, setYogaStyle] = useState<string>(
    editingCustom ? `custom:${editingCustom}` : (initial.yogaStyle ?? "integral"),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Custom names offered as dropdown options; include the one being edited if
  // the fetched list doesn't already contain it.
  const customStyleNames = [...yogaStyleCustoms];
  if (
    editingCustom &&
    !customStyleNames.some((s) => s.toLowerCase() === editingCustom.toLowerCase())
  ) {
    customStyleNames.push(editingCustom);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    if (type === "meditation" && formData.getAll("focusObjects").length === 0) {
      setError("Seleccioná al menos un objeto de foco");
      return;
    }
    if (
      type === "yoga" &&
      yogaStyle === "other" &&
      !String(formData.get("yogaStyleCustom") ?? "").trim()
    ) {
      setError("Nombrá el estilo de yoga");
      return;
    }
    // Resolve the select value into the persisted (yogaStyle, yogaStyleCustom).
    let resolvedYogaStyle: YogaStyle = "integral";
    let resolvedYogaStyleCustom: string | null = null;
    if (yogaStyle === "other") {
      resolvedYogaStyle = "other";
      resolvedYogaStyleCustom = String(formData.get("yogaStyleCustom") ?? "").trim() || null;
    } else if (yogaStyle.startsWith("custom:")) {
      resolvedYogaStyle = "other";
      resolvedYogaStyleCustom = yogaStyle.slice("custom:".length);
    } else {
      resolvedYogaStyle = yogaStyle as YogaStyle;
    }
    const raw = Object.fromEntries(formData.entries());
    const payload: PracticeInput =
      type === "yoga"
        ? {
            type: "yoga",
            date: new Date(String(raw.date)),
            durationMin: Number(raw.durationMin),
            guidance: raw.guidance as Guidance,
            yogaStyle: resolvedYogaStyle,
            yogaStyleCustom: resolvedYogaStyleCustom,
            moodBefore: raw.moodBefore ? Number(raw.moodBefore) : null,
            moodAfter: raw.moodAfter ? Number(raw.moodAfter) : null,
            notes: raw.notes ? String(raw.notes) : null,
          }
        : {
            type: "meditation",
            date: new Date(String(raw.date)),
            durationMin: Number(raw.durationMin),
            guidance: raw.guidance as Guidance,
            focusObjects: formData.getAll("focusObjects") as FocusObject[],
            position: raw.position as Position,
            moodBefore: raw.moodBefore ? Number(raw.moodBefore) : null,
            moodAfter: raw.moodAfter ? Number(raw.moodAfter) : null,
            notes: raw.notes ? String(raw.notes) : null,
          };

    const url = mode === "edit" && initial.id ? `/api/practices/${initial.id}` : "/api/practices";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: unknown };
      setError(typeof data.error === "string" ? data.error : "No se pudo guardar la práctica");
      return;
    }

    startTransition(() => {
      router.push("/diary/practices");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <Field label="Tipo de práctica" htmlFor="type" required>
        <Select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as PracticeType)}
          disabled={mode === "edit"}
        >
          <option value="yoga">Yoga</option>
          <option value="meditation">Meditación</option>
        </Select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Fecha y hora" htmlFor="date" required>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            defaultValue={toLocalDateTimeValue(initial.date)}
            required
          />
        </Field>

        <Field label="Duración (minutos)" htmlFor="durationMin" required>
          <Input
            id="durationMin"
            key={type}
            name="durationMin"
            type="number"
            min={1}
            max={1440}
            defaultValue={initial.durationMin ?? (type === "meditation" ? 15 : 60)}
            required
          />
        </Field>
      </div>

      <Field label="¿Cómo fue guiada?" htmlFor="guidance" required>
        <Select id="guidance" name="guidance" defaultValue={initial.guidance ?? "live"} required>
          {Object.entries(guidanceLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      {type === "yoga" ? (
        <>
          <Field label="Estilo de yoga" htmlFor="yogaStyle" required>
            <Select
              id="yogaStyle"
              name="yogaStyle"
              value={yogaStyle}
              onChange={(e) => setYogaStyle(e.target.value)}
              required
            >
              {Object.entries(yogaStyleLabels)
                .filter(([value]) => value !== "other")
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              {customStyleNames.map((s) => (
                <option key={s} value={`custom:${s}`}>
                  {s}
                </option>
              ))}
              <option value="other">{yogaStyleLabels.other}…</option>
            </Select>
          </Field>

          {yogaStyle === "other" ? (
            <Field
              label="¿Qué estilo?"
              htmlFor="yogaStyleCustom"
              hint="Se guarda para reusarlo la próxima vez"
              required
            >
              <Input
                id="yogaStyleCustom"
                name="yogaStyleCustom"
                defaultValue=""
                placeholder="Ej: Iyengar, Kundalini…"
                maxLength={100}
                autoComplete="off"
              />
            </Field>
          ) : null}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Objeto de foco" required>
            <ChipMultiSelect
              name="focusObjects"
              options={Object.entries(focusObjectLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              defaultValue={initial.focusObjects ?? []}
            />
          </Field>

          <Field label="Posición / lugar" htmlFor="position" required>
            <Select
              id="position"
              name="position"
              defaultValue={initial.position ?? "zafu"}
              required
            >
              {Object.entries(positionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-ink-900">Mood</p>
          <p className="text-xs text-ink-600">1: patrás · 5: prime</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="mx-auto w-full sm:w-fit text-center">
            <Field label="Antes" htmlFor="moodBefore">
              <MoodSlider
                id="moodBefore"
                name="moodBefore"
                defaultValue={initial.moodBefore ?? 3}
              />
            </Field>
          </div>

          <div className="mx-auto w-full sm:w-fit text-center">
            <Field label="Después" htmlFor="moodAfter">
              <MoodSlider id="moodAfter" name="moodAfter" defaultValue={initial.moodAfter ?? 3} />
            </Field>
          </div>
        </div>
      </div>

      <Field label="Notas" htmlFor="notes" hint="Opcional · sensaciones, insights, contexto">
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={initial.notes ?? ""}
          placeholder="Cómo me sentí, qué surgió, observaciones..."
        />
      </Field>

      {error ? (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md p-2">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Crear práctica"}
        </Button>
      </div>
    </form>
  );
}
