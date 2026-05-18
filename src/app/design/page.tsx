import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
import { Sparkle } from "@/components/decorative/Sparkle";
import { Cloud } from "@/components/decorative/Cloud";
import { Scallop } from "@/components/decorative/Scallop";
import { Marquee } from "@/components/decorative/Marquee";
import { HeroButtons, type HeroButtonsProps } from "@/components/HeroButtons";

type HeroCombo = {
  id: string;
  leftToken: string;
  rightToken: string;
  note?: string;
  props: HeroButtonsProps;
};

const HERO_COMBOS: HeroCombo[] = [
  {
    id: "brand-meditation",
    leftToken: "brand-primary",
    rightToken: "meditation-500",
    note: "Referencia. Violeta + teal, contraste complementario.",
    props: {
      leftBg: "var(--color-brand-primary)",
      rightBg: "var(--color-meditation-500)",
    },
  },
  {
    id: "action-meditation",
    leftToken: "action",
    rightToken: "meditation-500",
    note: "Naranja + teal. Máxima energía.",
    props: {
      leftBg: "var(--color-action)",
      rightBg: "var(--color-meditation-500)",
    },
  },
  {
    id: "yoga500-meditation500",
    leftToken: "yoga-500",
    rightToken: "meditation-500",
    note: "Lila claro + teal. Más calmo.",
    props: {
      leftBg: "var(--color-yoga-500)",
      rightBg: "var(--color-meditation-500)",
      leftText: "var(--color-ink-900)",
    },
  },
  {
    id: "brand-warm",
    leftToken: "brand-primary",
    rightToken: "warm",
    note: "Violeta + rosa suave. Contraste gentil.",
    props: {
      leftBg: "var(--color-brand-primary)",
      rightBg: "var(--color-warm)",
      rightText: "var(--color-ink-900)",
    },
  },
  {
    id: "secondary-action",
    leftToken: "brand-secondary",
    rightToken: "action",
    note: "Violeta profundo + naranja. Audaz.",
    props: {
      leftBg: "var(--color-brand-secondary)",
      rightBg: "var(--color-action)",
    },
  },
  {
    id: "meditation700-pink",
    leftToken: "meditation-700",
    rightToken: "pink-vivid",
    note: "Teal oscuro + rosa vibrante. Actual.",
    props: {
      leftBg: "var(--color-meditation-700)",
      rightBg: "var(--color-pink-vivid)",
      rightText: "var(--color-ink-900)",
    },
  },
  {
    id: "yoga700-meditation500",
    leftToken: "yoga-700",
    rightToken: "meditation-500",
    note: "Lila oscuro + teal. Más sobrio.",
    props: {
      leftBg: "var(--color-yoga-700)",
      rightBg: "var(--color-meditation-500)",
    },
  },
  {
    id: "hero-soft",
    leftToken: "hero-sage",
    rightToken: "hero-lavender",
    note: "Paleta del hero anterior, pastel.",
    props: {
      leftBg: "var(--color-hero-sage)",
      rightBg: "var(--color-hero-lavender)",
      leftText: "var(--color-ink-900)",
      rightText: "var(--color-ink-900)",
    },
  },
];

// Internal design reference for tokens, primitives and hero combinations.
// Gated to development so it never ships to production.
export default function DesignPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16 pb-24">
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-display-2xl text-brand-primary">
          design
        </h1>
        <p className="text-ink-600 max-w-xl">
          Sistema de diseño de Caleidoscopio — paleta, tipografía, primitivos,
          decoraciones y combinaciones del hero. Solo visible en development.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">paleta</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Swatch name="brand-primary" className="bg-brand-primary text-white" />
          <Swatch name="brand-secondary" className="bg-brand-secondary text-white" />
          <Swatch name="action" className="bg-action text-white" />
          <Swatch name="action-hover" className="bg-action-hover text-white" />
          <Swatch name="yoga-500" className="bg-yoga-500 text-ink-900" />
          <Swatch name="meditation-500" className="bg-meditation-500 text-ink-900" />
          <Swatch name="warm" className="bg-warm text-ink-900" />
          <Swatch name="surface-soft" className="bg-surface-soft text-ink-900" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">tipografía</h2>
        <div className="flex flex-col gap-2">
          <p className="font-display text-display-2xl text-brand-primary">
            display 2xl
          </p>
          <p className="font-display text-display-xl text-brand-primary">
            display xl
          </p>
          <p className="font-display text-display-lg">display lg</p>
          <p className="font-display text-display-md">display md</p>
          <p className="text-lg">body large — Inter para texto extendido.</p>
          <p className="text-base">body base — el default.</p>
          <p className="text-sm text-ink-600">body small en ink-600.</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">buttons</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="yoga">Yoga</Button>
          <Button variant="meditation">Meditation</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra large</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">badges</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge variant="yoga">yoga</Badge>
          <Badge variant="meditation">meditación</Badge>
          <Badge variant="neutral">neutral</Badge>
          <Badge variant="action">acción</Badge>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge variant="yoga" size="sm">sm</Badge>
          <Badge variant="yoga" size="md">md</Badge>
          <Badge variant="yoga" size="lg">lg</Badge>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="white">
            <h3 className="font-display text-display-md mb-2">Card white</h3>
            <p className="text-ink-600">Default, fondo blanco.</p>
          </Card>
          <Card variant="soft">
            <h3 className="font-display text-display-md mb-2">Card soft</h3>
            <p className="text-ink-600">Tinte lavanda suave.</p>
          </Card>
          <Card variant="brand">
            <h3 className="font-display text-display-md mb-2">Card brand</h3>
            <p className="text-white/80">Violeta primary, texto blanco.</p>
          </Card>
          <Card variant="warm">
            <h3 className="font-display text-display-md mb-2">Card warm</h3>
            <p className="text-ink-600">Durazno suave para acentos cálidos.</p>
          </Card>
          <Card variant="meditation">
            <h3 className="font-display text-display-md mb-2">Card meditation</h3>
            <p className="text-ink-900/80">
              Teal sólido como surface — texto en ink-900 para AA holgado.
            </p>
          </Card>
          <Card variant="yoga">
            <h3 className="font-display text-display-md mb-2">Card yoga</h3>
            <p className="text-ink-900/80">
              Lila sólido. Mismo patrón que la meditation card.
            </p>
          </Card>
          <Card variant="white" interactive>
            <h3 className="font-display text-display-md mb-2">Card interactive</h3>
            <p className="text-ink-600">Hover: leve elevación.</p>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">inputs</h2>
        <Card variant="white" className="max-w-md">
          <div className="flex flex-col gap-4">
            <Field label="Nombre" htmlFor="demo-name" required>
              <Input id="demo-name" placeholder="Tu nombre" />
            </Field>
            <Field
              label="Tipo de práctica"
              htmlFor="demo-type"
              hint="Yoga o meditación."
            >
              <Select id="demo-type">
                <option value="yoga">Yoga</option>
                <option value="meditation">Meditación</option>
              </Select>
            </Field>
            <Field label="Notas" htmlFor="demo-notes">
              <Textarea id="demo-notes" rows={3} placeholder="¿Cómo te sentiste?" />
            </Field>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">decoraciones</h2>
        <Card variant="white" padding="lg">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-brand-primary">
              <Sparkle size={32} />
              <Sparkle size={24} className="animate-[spin-slow_12s_linear_infinite]" />
              <Sparkle size={16} />
            </div>
            <div className="flex items-center gap-4 text-meditation-500">
              <Cloud variant="small" />
              <Cloud variant="medium" />
              <Cloud variant="large" />
            </div>
          </div>
        </Card>
        <div className="relative bg-brand-primary rounded-2xl overflow-hidden">
          <div className="p-12 text-white">
            <p className="font-display text-display-md">sección violeta</p>
            <p className="text-white/80">
              El scallop de abajo deja caer el violeta sobre la crema.
            </p>
          </div>
          <div className="text-brand-primary -mb-px">
            <Scallop flip />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">marquee</h2>
        <div className="bg-meditation-100 text-meditation-700 rounded-2xl">
          <Marquee
            items={["respirá", "presente", "ahora", "respirá", "presente", "ahora"]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-display-lg">hero — botones</h2>
        <p className="text-sm text-ink-600 max-w-xl">
          Combinaciones de paleta para el par de botones del home. Cada bloque
          es clickeable (lleva a /practices/new o /meditate). La combinación
          marcada como &quot;actual&quot; es la que está en uso.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {HERO_COMBOS.map((combo, i) => (
            <div key={combo.id} className="flex flex-col gap-3">
              <HeroButtons {...combo.props} className="max-w-md" />
              <div className="flex flex-col gap-0.5 px-2">
                <p className="text-sm font-mono text-ink-900">
                  {i + 1}. {combo.leftToken} × {combo.rightToken}
                </p>
                {combo.note && (
                  <p className="text-xs text-ink-600">{combo.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div
      className={`rounded-xl p-4 h-24 flex flex-col justify-end shadow-soft ${className}`}
    >
      <span className="font-mono text-xs">{name}</span>
    </div>
  );
}
