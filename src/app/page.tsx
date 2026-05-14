import Link from "next/link";
import { PracticeList } from "@/components/PracticeList";
import { listPractices, practiceFilterSchema } from "@/lib/practice";
import { practiceTypeLabels } from "@/lib/labels";

type SearchParams = Promise<{ type?: string }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const filterParse = practiceFilterSchema.safeParse({ type: raw.type });
  const filter = filterParse.success ? filterParse.data : {};
  const practices = await listPractices(filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Tu diario</h1>
        <p className="text-sm text-stone-600 mt-1">
          {practices.length} práctica{practices.length === 1 ? "" : "s"}{" "}
          registrada{practices.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="flex gap-2">
        <FilterChip href="/" label="Todas" active={!filter.type} />
        <FilterChip
          href="/?type=yoga"
          label={practiceTypeLabels.yoga}
          active={filter.type === "yoga"}
        />
        <FilterChip
          href="/?type=meditation"
          label={practiceTypeLabels.meditation}
          active={filter.type === "meditation"}
        />
      </div>

      <PracticeList practices={practices} />
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const base = "text-sm px-3 py-1.5 rounded-full border";
  const cls = active
    ? "bg-stone-900 text-white border-stone-900"
    : "bg-white text-stone-700 border-stone-300 hover:border-stone-500";
  return (
    <Link href={href} className={`${base} ${cls}`}>
      {label}
    </Link>
  );
}
